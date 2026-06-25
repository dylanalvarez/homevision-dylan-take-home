"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
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

interface AnnotatedPdfViewerProps {
    pdfPath: string;
    annotationsByPageNumber: PageAnnotations;
}

const UPDATE_PDF_PAGE_WIDTH_DELAY_MS = 150;
// Placeholder lingers slightly longer so the re-rendered PDF is ready before it disappears
const REMOVE_PLACEHOLDER_DELAY_MS = UPDATE_PDF_PAGE_WIDTH_DELAY_MS + 50;

const MAX_PDF_WIDTH_PX = 900;
const MIN_SPACE_AROUND_PDF_PX = 20;

const calculatePdfPageWidth = () =>
    typeof document !== "undefined"
        ? Math.min(document.documentElement.clientWidth - MIN_SPACE_AROUND_PDF_PX, MAX_PDF_WIDTH_PX)
        : MAX_PDF_WIDTH_PX;

export default function AnnotatedPdfViewer({
                                               pdfPath,
                                               annotationsByPageNumber,
                                           }: AnnotatedPdfViewerProps): React.ReactElement {
    const [pageCount, setPageCount] = useState<number | null>(null);
    const [documentLoadError, setDocumentLoadError] =
        useState<string | null>(null);

    const onDocumentLoadSuccess = useCallback(
        ({numPages}: { numPages: number }) => {
            setPageCount(numPages);
            setDocumentLoadError(null);
        },
        []
    );

    const onDocumentLoadError = useCallback(({message}: Error) => {
        setDocumentLoadError(message);
    }, []);

    const [resizingPlaceholderWidth, setResizingPlaceholderWidth] = useState<number | null>(null);
    const [pdfPageWidth, setPdfPageWidth] = useState(calculatePdfPageWidth());

    const removeResizingPlaceholderTimeout = useRef<NodeJS.Timeout | null>(null);
    const updatePdfPageWidthTimeout = useRef<NodeJS.Timeout | null>(null);

    // Avoid redrawing the PDF a bunch of times by resizing a simple placeholder until the new width is set.
    // Start rendering the actual content a bit before removing the placeholder so we hide the re-rendering process.
    useEffect(() => {
        const onResize = () => {
            const newPdfPageWidth = calculatePdfPageWidth()

            setResizingPlaceholderWidth(newPdfPageWidth);

            if (removeResizingPlaceholderTimeout.current) clearTimeout(removeResizingPlaceholderTimeout.current);
            if (updatePdfPageWidthTimeout.current) clearTimeout(updatePdfPageWidthTimeout.current);

            updatePdfPageWidthTimeout.current = setTimeout(() => {
                setPdfPageWidth(newPdfPageWidth);
            }, UPDATE_PDF_PAGE_WIDTH_DELAY_MS);

            removeResizingPlaceholderTimeout.current = setTimeout(() => {
                setResizingPlaceholderWidth(null);
            }, REMOVE_PLACEHOLDER_DELAY_MS);
        };

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            if (removeResizingPlaceholderTimeout.current) clearTimeout(removeResizingPlaceholderTimeout.current);
            if (updatePdfPageWidthTimeout.current) clearTimeout(updatePdfPageWidthTimeout.current);
        };
    }, []);

    const renderedPages = useMemo(() => {
        if (pageCount === null) return null;

        const items: React.ReactNode[] = [];

        for (let page = 1; page <= pageCount; page++) {
            const annotationNode = annotationsByPageNumber[String(page)];

            items.push(
                <div key={`page-container-${page}`}
                     className="flex flex-col items-center rounded shadow-lg overflow-hidden mb-8">
                    {annotationNode !== undefined && (
                        <AnnotationContainer width={pdfPageWidth}>
                            {annotationNode}
                        </AnnotationContainer>
                    )}

                    <div className="bg-white">
                        <Page
                            pageNumber={page}
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