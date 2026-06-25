"use client";

import React from "react";
import {IssueNavButtons} from "@/components/IssueNavigator/IssueNavButtons";
import {IssueNavSummary} from "@/components/IssueNavigator/IssueNavSummary";


interface IssueNavigatorProps {
    currentPage: number;
    pageCount: number | null;
    pageNumbersWithIssues: number[];
    jumpToPage: (pageNumber: number) => void;
}

export function IssueNavigator({currentPage, pageCount, pageNumbersWithIssues, jumpToPage}: IssueNavigatorProps) {
    return (
        <div
            className="fixed top-14 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
            <IssueNavSummary
                currentPage={currentPage}
                pageCount={pageCount}
            />
            <IssueNavButtons
                currentPage={currentPage}
                pageNumbersWithIssues={pageNumbersWithIssues}
                onNavigate={jumpToPage}
            />
        </div>
    );
}