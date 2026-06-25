"use client";

import dynamic from "next/dynamic";
import React, {ReactNode, useMemo} from "react";
import PageWithNavbar from "@/components/PageWithNavBar";
import {Issues, PageIssues} from "@/components/PageIssues";

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

    return (
        <PageWithNavbar navbarContent={<></>}>
            <AnnotatedPdfViewer
                pdfPath={pdfPath}
                annotationsByPageNumber={renderedIssuesByPageNumber}
            />
        </PageWithNavbar>
    );
}
