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
    // NOTE: This mock response shape is my best guess based on the
    // "Response fields" section in the challenge description.
    // The actual mock may differ from the one linked as `review_mock.json`.
    // I don't have Notion access to view that file,
    // so field names/nesting may not match exactly.
    const mockResponse = useMemo(() => ({
        name: "example_document.pdf",
        uploaded_at: "2026-06-20T14:32:00Z",
        status: "on_review",
        version: 3,
        user: "homer.simpson@example.com",
        issues: {
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
        },
        document: {
            url: "/example_document.pdf",
            pages: [
                {page: 1, size: 245678},
                {page: 2, size: 198432},
                {page: 3, size: 312045},
                {page: 4, size: 287901},
                {page: 5, size: 234187},
                {page: 6, size: 269543},
                {page: 7, size: 256120},
                {page: 8, size: 291876},
                {page: 9, size: 301456},
                {page: 10, size: 218765},
                {page: 11, size: 276432},
                {page: 12, size: 309821},
                {page: 13, size: 243098},
                {page: 14, size: 278934},
                {page: 15, size: 213560},
                {page: 16, size: 265432},
                {page: 17, size: 297651},
                {page: 18, size: 345210},
                {page: 19, size: 228976},
                {page: 20, size: 254387},
                {page: 21, size: 286543},
                {page: 22, size: 298765},
                {page: 23, size: 219854},
                {page: 24, size: 273098},
                {page: 25, size: 305432},
                {page: 26, size: 241765},
                {page: 27, size: 287654},
                {page: 28, size: 232109},
                {page: 29, size: 267890},
                {page: 30, size: 221034},
                {page: 31, size: 259876},
                {page: 32, size: 294321},
                {page: 33, size: 237654},
                {page: 34, size: 262198},
            ],
        },
    }), []);

    const issuesByPageNumber: { [pageNumber: string]: Issues } = useMemo(
        () => mockResponse.issues,
        [mockResponse]
    );

    const pdfPath = mockResponse.document.url;

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