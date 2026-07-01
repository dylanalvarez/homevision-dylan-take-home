"use client";

import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState,} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import {AnnotationContainer} from "@/components/AnnotatedPdfViewer/AnnotationContainer";
import {ResizingPlaceholder} from "@/components/AnnotatedPdfViewer/ResizingPlaceholder";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

type PageAnnotations = Record<string, React.ReactNode>;

export interface AnnotatedPdfViewerHandle {
    jumpToPage: (page: number) => void;
}

interface AnnotatedPdfViewerProps {
    pdfPath: string;
    annotationsByPageNumber: PageAnnotations;
    onPageFocus?: (page: number) => void;
    onPageCountChange?: (pageCount: number) => void;
}

const UPDATE_PDF_PAGE_WIDTH_DELAY_MS = 150;
// Placeholder lingers slightly longer so the re-rendered PDF is ready before it disappears
const REMOVE_PLACEHOLDER_DELAY_MS = UPDATE_PDF_PAGE_WIDTH_DELAY_MS + 50;

const MAX_PDF_WIDTH_PX = 900;
const MIN_SPACE_AROUND_PDF_PX = 40;

const calculatePdfPageWidth = () =>
    typeof document !== "undefined"
        ? Math.min(document.documentElement.clientWidth - MIN_SPACE_AROUND_PDF_PX, MAX_PDF_WIDTH_PX)
        : MAX_PDF_WIDTH_PX;

const AnnotatedPdfViewer = forwardRef<AnnotatedPdfViewerHandle, AnnotatedPdfViewerProps>(
    function AnnotatedPdfViewer({pdfPath, annotationsByPageNumber, onPageFocus, onPageCountChange}, ref) {
        const [pageCount, setPageCount] = useState<number | null>(null);
        const [documentLoadError, setDocumentLoadError] = useState<string | null>(null);

        const onDocumentLoadSuccess = useCallback(
            ({numPages}: { numPages: number }) => {
                setPageCount(numPages);
                onPageCountChange?.(numPages);
                setDocumentLoadError(null);
            },
            [onPageCountChange]
        );

        const onDocumentLoadError = useCallback(({message}: Error) => {
            setDocumentLoadError(message);
        }, []);

        const [resizingPlaceholderWidth, setResizingPlaceholderWidth] = useState<number | null>(null);
        const [pdfPageWidth, setPdfPageWidth] = useState(calculatePdfPageWidth());

        const removeResizingPlaceholderTimeout = useRef<NodeJS.Timeout | null>(null);
        const updatePdfPageWidthTimeout = useRef<NodeJS.Timeout | null>(null);

        const lastViewportWidthRef = useRef<number | null>(null);

        const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

        // Guards setState calls from in-flight timers/observers that resolve after unmount.
        const isMountedRef = useRef(true);

        useEffect(() => {
            isMountedRef.current = true;
            return () => {
                isMountedRef.current = false;
            };
        }, []);

        const onPageFocusRef = useRef(onPageFocus);
        useEffect(() => {
            onPageFocusRef.current = onPageFocus;
        }, [onPageFocus]);

        useImperativeHandle(
            ref,
            () => ({
                jumpToPage: (page: number) => {
                    if (!Number.isInteger(page) || page < 1 || (pageCount !== null && page > pageCount)) {
                        console.warn(
                            `AnnotatedPdfViewer.jumpToPage: "${page}" is not a valid page number` +
                            (pageCount !== null ? ` (document has ${pageCount} page(s)).` : ".")
                        );
                        return;
                    }

                    const target = pageRefs.current[page];
                    if (!target) {
                        console.warn(`AnnotatedPdfViewer.jumpToPage: page ${page} is not currently rendered.`);
                        return;
                    }

                    target.scrollIntoView({behavior: "instant"});
                },
            }),
            [pageCount]
        );

        useEffect(() => {
            if (!onPageFocus || pageCount === null) return;

            const intersectionRatiosByPageNumber: Record<number, number> = {};

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        const pageNumber = Number(entry.target.getAttribute("data-page-number"));
                        intersectionRatiosByPageNumber[pageNumber] = entry.intersectionRatio;
                    });

                    const mostVisible = Object.entries(intersectionRatiosByPageNumber)
                        .filter(([, ratio]) => ratio > 0)
                        .sort(([, a], [, b]) => b - a)[0];

                    if (mostVisible && isMountedRef.current) {
                        onPageFocusRef.current?.(Number(mostVisible[0]));
                    }
                },
                {threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0]}
            );

            const observedElements = Object.values(pageRefs.current).filter(
                (el): el is HTMLDivElement => el !== null
            );
            observedElements.forEach((el) => observer.observe(el));

            return () => {
                observedElements.forEach((el) => observer.unobserve(el));
                observer.disconnect();
            };
        }, [pageCount, onPageFocus]);

        useEffect(() => {
            lastViewportWidthRef.current = document.documentElement.clientWidth;

            const clearPendingTimeouts = () => {
                if (removeResizingPlaceholderTimeout.current) {
                    clearTimeout(removeResizingPlaceholderTimeout.current);
                    removeResizingPlaceholderTimeout.current = null;
                }
                if (updatePdfPageWidthTimeout.current) {
                    clearTimeout(updatePdfPageWidthTimeout.current);
                    updatePdfPageWidthTimeout.current = null;
                }
            };

            const onResize = () => {
                const newViewportWidth = document.documentElement.clientWidth;

                if (newViewportWidth === lastViewportWidthRef.current) {
                    // If only height changed the PDF won't be redrawn
                    // so we skip the placeholder entirely.
                    return;
                }
                lastViewportWidthRef.current = newViewportWidth;

                const newPdfPageWidth = calculatePdfPageWidth();

                if (isMountedRef.current) {
                    setResizingPlaceholderWidth(newPdfPageWidth);
                }

                clearPendingTimeouts();

                updatePdfPageWidthTimeout.current = setTimeout(() => {
                    if (isMountedRef.current) {
                        setPdfPageWidth(newPdfPageWidth);
                    }
                }, UPDATE_PDF_PAGE_WIDTH_DELAY_MS);

                removeResizingPlaceholderTimeout.current = setTimeout(() => {
                    if (isMountedRef.current) {
                        setResizingPlaceholderWidth(null);
                    }
                }, REMOVE_PLACEHOLDER_DELAY_MS);
            };

            window.addEventListener("resize", onResize);

            return () => {
                window.removeEventListener("resize", onResize);
                clearPendingTimeouts();
            };
        }, []);

        const renderedPages = useMemo(() => {
            if (pageCount === null) return null;

            const items: React.ReactNode[] = [];

            for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
                const annotationNode = annotationsByPageNumber[String(pageNumber)];

                items.push(
                    <div
                        key={`page-container-${pageNumber}`}
                        ref={(el) => {
                            pageRefs.current[pageNumber] = el;
                        }}
                        data-page-number={pageNumber}
                        className="flex flex-col items-center scroll-mt-32 rounded shadow-lg overflow-hidden mb-8"
                        style={{border: `solid 1px ${annotationNode ? "red" : "transparent"}`}}
                    >
                        {annotationNode !== undefined && (
                            <AnnotationContainer width={pdfPageWidth}>
                                {annotationNode}
                            </AnnotationContainer>
                        )}

                        <div className="bg-white">
                            <Page
                                pageNumber={pageNumber}
                                width={pdfPageWidth}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                            />
                        </div>
                    </div>
                );
            }

            return items;
        }, [annotationsByPageNumber, pageCount, pdfPageWidth]);

        return (
            <div className="min-h-screen px-4 py-8 font-sans relative flex justify-center">
                {resizingPlaceholderWidth && <ResizingPlaceholder width={resizingPlaceholderWidth}/>}

                <div
                    className="w-full flex justify-center"
                    style={{opacity: resizingPlaceholderWidth ? 0 : 1}}
                >
                    <Document
                        file={pdfPath}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={<p className="mt-12 text-center text-gray-800">Loading PDF</p>}
                        error={
                            <p className="mt-12 text-center text-red-500">
                                {documentLoadError ?? "Failed to load PDF"}
                            </p>
                        }
                    >
                        {renderedPages}
                    </Document>
                </div>
            </div>
        );
    }
);

export default AnnotatedPdfViewer;