"use client";

import dynamic from "next/dynamic";
import React, {ReactNode, useCallback, useMemo, useRef, useState} from "react";
import PageWithNavbar from "@/components/PageWithNavBar/PageWithNavBar";
import {Issues, PageIssues} from "@/components/PageIssues/PageIssues";
import {AnnotatedPdfViewerHandle} from "@/components/AnnotatedPdfViewer/AnnotatedPdfViewer";
import {IssueNavigator} from "@/components/IssueNavigator/IssueNavigator";
import {BottomActionBar} from "@/app/review/BottomActionBar/BottomActionBar";
import {useRouter} from "next/navigation";

const AnnotatedPdfViewer = dynamic(
    () => import("@/components/AnnotatedPdfViewer/AnnotatedPdfViewer"),
    {ssr: false}
);

export default function Review() {
    const issuesByPageNumber: { [pageNumber: string]: Issues } = useMemo(() => ({
        "3": {
            major: ["Label 'Borrower.' uses a period instead of a colon, breaking layout consistency."],
            minor: ["Abbreviation 'Sub.' in left column is cut off and unexplained."],
        },
        "4": {
            critical: ["Ownership conflict: Text states current contract seller is Nedward Flanders, but records show Homer J. Simpson has owned it since 2008."],
        },
        "7": {
            minor: ["Site Improvements list layout is missing bullet points or proper alignment markers."],
        },
        "9": {
            major: ["Inconsistent rating formatting for schools ('7/10' vs '6/10')."],
        },
        "14": {
            critical: ["Malformed room/bath count for Comp #1 listed as '31.5/' in the summary grid."],
            major: ["Inconsistent location code formatting for Comp #3 ('N Res B' vs 'N:Res:B')."],
        },
        "15": {
            minor: ["Typo in adjustment rationale text: 'hornes' instead of 'homes'."],
        },
        "18": {
            critical: ["Front Exterior photograph displays a 2-story architectural cabin completely mismatched with the 1-story ranch house description."],
        },
        "22": {
            critical: ["The photograph labeled 'Family Room' features an active dining table layout rather than a family living space."],
            minor: ["Missing commas or periods at the end of several photo descriptive captions."],
        },
        "29": {
            major: ["The analytical columns for Comp #2 contain multiple blank fields including Price/SF and Condition."],
        },
        "30": {
            minor: ["The mathematical formula text for Subject Price Per Square Foot runs together awkwardly with the surrounding prose."],
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
            <div className="pt-14 pb-14">
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