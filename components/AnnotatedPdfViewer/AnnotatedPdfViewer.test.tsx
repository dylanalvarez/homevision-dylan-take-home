/* eslint-disable @typescript-eslint/no-require-imports */
// require() is necessary inside jest.mock() factories because jest.mock is
// hoisted before ESM imports, making the imported React binding unavailable.

/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock boundaries in tests intentionally bypass strict typing — the value of
// typing these is low and the noise is high.

import {createRef} from "react";
import {act, render, screen} from "@testing-library/react";
import AnnotatedPdfViewer, {AnnotatedPdfViewerHandle,} from "@/components/AnnotatedPdfViewer/AnnotatedPdfViewer";

const pdfCallbacks: {
    onLoadSuccess?: (data: { numPages: number }) => void;
    onLoadError?: (error: Error) => void;
} = {};

jest.mock("react-pdf", () => {
    const React = require("react");
    return {
        pdfjs: {GlobalWorkerOptions: {workerSrc: ""}},
        Document: ({onLoadSuccess, onLoadError, loading, children}: any) => {
            pdfCallbacks.onLoadSuccess = onLoadSuccess;
            pdfCallbacks.onLoadError = onLoadError;
            return React.createElement(
                "div",
                {"data-testid": "pdf-document"},
                children ?? loading
            );
        },
        Page: ({pageNumber}: any) =>
            React.createElement("div", {"data-testid": `pdf-page-${pageNumber}`}),
    };
});

jest.mock("./AnnotationContainer", () => ({
    AnnotationContainer: ({children}: any) => {
        const React = require("react");
        return React.createElement("div", {"data-testid": "annotation-container"}, children);
    }
}));

jest.mock("./ResizingPlaceholder", () => ({
    ResizingPlaceholder: () => {
        const React = require("react");
        return React.createElement("div", {"data-testid": "resizing-placeholder"})
    },
}));

let intersectionCallback: IntersectionObserverCallback;

beforeAll(() => {
    window.IntersectionObserver = class MockIntersectionObserver {
        constructor(cb: IntersectionObserverCallback) {
            intersectionCallback = cb;
        }

        observe = jest.fn();
        disconnect = jest.fn();
        unobserve = jest.fn();
    } as any;
});

const defaultProps = {
    pdfPath: "/sample.pdf",
    annotationsByPageNumber: {},
};

function loadDocument(numPages: number) {
    act(() => pdfCallbacks.onLoadSuccess?.({numPages}));
}

function fireIntersection(ratiosByPage: Record<number, number>) {
    act(() => {
        intersectionCallback(
            Object.entries(ratiosByPage).map(([pageNum, ratio]) => ({
                target: {getAttribute: () => pageNum},
                intersectionRatio: ratio,
            })) as any[],
            {} as IntersectionObserver
        );
    });
}


describe("AnnotatedPdfViewer", () => {
    describe("Loading state", () => {
        it("shows a loading message before the PDF document loads", () => {
            render(<AnnotatedPdfViewer {...defaultProps} />);
            expect(screen.getByText(/loading pdf/i)).toBeInTheDocument();
        });
    });

    describe("Page rendering", () => {
        it("renders the correct number of pages after a successful load", () => {
            render(<AnnotatedPdfViewer {...defaultProps} />);
            loadDocument(3);

            expect(screen.getByTestId("pdf-page-1")).toBeInTheDocument();
            expect(screen.getByTestId("pdf-page-2")).toBeInTheDocument();
            expect(screen.getByTestId("pdf-page-3")).toBeInTheDocument();
        });

        it("calls onPageCountChange with the page count on load success", () => {
            const onPageCountChange = jest.fn();
            render(
                <AnnotatedPdfViewer
                    {...defaultProps}
                    onPageCountChange={onPageCountChange}
                />
            );
            loadDocument(7);

            expect(onPageCountChange).toHaveBeenCalledTimes(1);
            expect(onPageCountChange).toHaveBeenCalledWith(7);
        });
    });

    describe("Annotations", () => {
        it("renders an AnnotationContainer for each annotated page", () => {
            render(
                <AnnotatedPdfViewer
                    {...defaultProps}
                    annotationsByPageNumber={{
                        "1": <span>Issue on page 1</span>,
                        "3": <span>Issue on page 3</span>,
                    }}
                />
            );
            loadDocument(4);

            expect(screen.getAllByTestId("annotation-container")).toHaveLength(2);
        });

        it("renders no AnnotationContainers when there are no annotations", () => {
            render(
                <AnnotatedPdfViewer {...defaultProps} annotationsByPageNumber={{}}/>
            );
            loadDocument(3);

            expect(
                screen.queryByTestId("annotation-container")
            ).not.toBeInTheDocument();
        });
    });

    describe("jumpToPage (imperative handle)", () => {
        it("calls scrollIntoView with instant behaviour on the correct page", () => {
            const ref = createRef<AnnotatedPdfViewerHandle>();
            render(<AnnotatedPdfViewer {...defaultProps} ref={ref}/>);
            loadDocument(3);

            const pageContainer = document.querySelector(
                '[data-page-number="2"]'
            ) as HTMLElement;
            const scrollIntoView = jest.fn();
            pageContainer.scrollIntoView = scrollIntoView;

            act(() => ref.current?.jumpToPage(2));

            expect(scrollIntoView).toHaveBeenCalledWith({behavior: "instant"});
        });
    });

    describe("Page focus tracking (IntersectionObserver)", () => {
        it("calls onPageFocus with the page that has the highest intersection ratio", () => {
            const onPageFocus = jest.fn();
            render(
                <AnnotatedPdfViewer {...defaultProps} onPageFocus={onPageFocus}/>
            );
            loadDocument(3);

            fireIntersection({1: 0.2, 2: 0.9, 3: 0.4});

            expect(onPageFocus).toHaveBeenCalledWith(2);
        });

        it("does not call onPageFocus when no pages are visible (ratio === 0)", () => {
            const onPageFocus = jest.fn();
            render(
                <AnnotatedPdfViewer {...defaultProps} onPageFocus={onPageFocus}/>
            );
            loadDocument(3);

            fireIntersection({1: 0, 2: 0, 3: 0});

            expect(onPageFocus).not.toHaveBeenCalled();
        });
    });
});