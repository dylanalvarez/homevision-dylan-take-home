import React from "react";

interface IssueNavButtonsProps {
    currentPage: number;
    pageNumbersWithIssues: number[];
    onNavigate: (page: number) => void;
}

export function IssueNavButtons({currentPage, pageNumbersWithIssues, onNavigate}: IssueNavButtonsProps) {
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

    const aboveCount = pageNumbersWithIssues.filter(n => n < currentPage).length;
    const belowCount = pageNumbersWithIssues.filter(n => n > currentPage).length;
    const currentPageHasIssues = pageNumbersWithIssues.length !== aboveCount + belowCount;

    return (
        <div className="flex items-center gap-1 font-medium text-gray-800">
            <p>{currentPageHasIssues ? `Issue ${aboveCount + 1} of ${pageNumbersWithIssues.length}` : "Jump to issues"}</p>
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
