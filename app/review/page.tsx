"use client";

import dynamic from "next/dynamic";
import React, {ReactNode, useCallback, useMemo, useRef, useState} from "react";
import PageWithNavbar from "@/components/PageWithNavBar";
import {Issues, PageIssues} from "@/components/PageIssues";
import {AnnotatedPdfViewerHandle} from "@/components/AnnotatedPdfViewer";
import {IssueNavigator} from "@/components/IssueNavigator";
import {BottomActionBar} from "@/app/review/BottomActionBar";
import {useRouter} from "next/navigation";

const AnnotatedPdfViewer = dynamic(
    () => import("@/components/AnnotatedPdfViewer"),
    {ssr: false}
);

export default function Review() {
    const issuesByPageNumber: { [pageNumber: string]: Issues } = useMemo(() => ({
        "3": {
            critical: ["this is all wrong", "that is wrong too"],
            major: ["this should have a comma not a dot"],
            minor: ["There's two spaces after this dot"],
        },
        "6": {
            critical: ["lorem ipsum"],
            major: ["go on and take", "a bow"],
        },
        "7": {
            critical: ["only sorry you got caught"],
            minor: ["really had me going", "curtain's finally closing"],
        },
        "11": {
            minor: ["and the award", "making me believe that you"],
        },
    }), []);

    const pdfPath = "/example_document.pdf";

    const renderedIssuesByPageNumber = useMemo(() => {
        const result: { [pageNumber: string]: ReactNode } = {};

        for (const pageNumber in issuesByPageNumber) {
            const annotation = issuesByPageNumber[pageNumber];
            if (annotation) {
                result[pageNumber] = <PageIssues issues={annotation}/>;
            }
        }

        return result;
    }, [issuesByPageNumber]);

    const pdfViewerRef = useRef<AnnotatedPdfViewerHandle>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState<number | null>(null);

    const jumpToPage = useCallback((page: number) => {
        pdfViewerRef.current?.jumpToPage(page);
    }, []);

    const router = useRouter();

    return (
        <PageWithNavbar>
            <IssueNavigator
                currentPage={currentPage}
                pageCount={pageCount}
                pageNumbersWithIssues={Object.keys(issuesByPageNumber).map(Number)}
                jumpToPage={jumpToPage}
            />
            <div className="pt-14">
                <AnnotatedPdfViewer
                    ref={pdfViewerRef}
                    onPageFocus={setCurrentPage}
                    onPageCountChange={setPageCount}
                    pdfPath={pdfPath}
                    annotationsByPageNumber={renderedIssuesByPageNumber}
                />
            </div>
            <BottomActionBar hasIssues={Object.keys(issuesByPageNumber).length > 0} onUpload={() => router.push("/")}
                             onSubmit={() => alert("TBD: Submit page")}/>
        </PageWithNavbar>
    );
}