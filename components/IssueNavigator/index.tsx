"use client";

import React from "react";


interface IssueNavSummaryProps {
    currentPage: number;
    pageNumbersWithIssues: number[];
}

function IssueNavSummary({currentPage, pageNumbersWithIssues}: IssueNavSummaryProps) {
    const aboveCount = pageNumbersWithIssues.filter(n => n < currentPage).length;
    const belowCount = pageNumbersWithIssues.filter(n => n > currentPage).length;
    const currentPageHasIssues = pageNumbersWithIssues.length !== aboveCount + belowCount;

    const parts: string[] = [];
    if (aboveCount > 0) parts.push(`${aboveCount} issue${aboveCount !== 1 ? "s" : ""} above`);
    if (belowCount > 0) parts.push(`${belowCount} issue${belowCount !== 1 ? "s" : ""} below`);

    return (
        <span className="text-sm text-gray-600">
            <span
                className="font-medium text-gray-800">Page {currentPage}{currentPageHasIssues ? " (with issues)" : ""}.</span>
            {" "}
            {parts.length > 0 ? parts.join(", ") : "No other issues"}
        </span>
    );
}

interface IssueNavButtonsProps {
    currentPage: number;
    pageNumbersWithIssues: number[];
    onNavigate: (page: number) => void;
}

function IssueNavButtons({currentPage, pageNumbersWithIssues, onNavigate}: IssueNavButtonsProps) {
    let previousPageWithIssues: number | null = null;
    let nextPageWithIssues: number | null = null;

    for (const page of pageNumbersWithIssues) {
        if (page < currentPage && (previousPageWithIssues === null || page > previousPageWithIssues)) {
            previousPageWithIssues = page;
        }

        if (page > currentPage && (nextPageWithIssues === null || page < nextPageWithIssues)) {
            nextPageWithIssues = page;
        }
    }

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={() => previousPageWithIssues !== null && onNavigate(previousPageWithIssues)}
                disabled={previousPageWithIssues === null}
                aria-label="Previous page with issues"
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                ▲
            </button>
            <button
                onClick={() => nextPageWithIssues !== null && onNavigate(nextPageWithIssues)}
                disabled={nextPageWithIssues === null}
                aria-label="Next page with issues"
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                ▼
            </button>
        </div>
    );
}

interface IssueNavigatorProps {
    currentPage: number;
    pageNumbersWithIssues: number[];
    jumpToPage: (pageNumber: number) => void;
}

export function IssueNavigator({currentPage, pageNumbersWithIssues, jumpToPage}: IssueNavigatorProps) {
    return (
        <div
            className="fixed top-14 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
            <IssueNavSummary
                currentPage={currentPage}
                pageNumbersWithIssues={pageNumbersWithIssues}
            />
            <IssueNavButtons
                currentPage={currentPage}
                pageNumbersWithIssues={pageNumbersWithIssues}
                onNavigate={jumpToPage}
            />
        </div>
    );
}