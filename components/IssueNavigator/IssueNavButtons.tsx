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

    const buttonClassNames = `
        flex items-center justify-center w-7 h-7
        text-gray-500
        hover:bg-gray-100 hover:text-gray-800
        active:bg-gray-200 active:text-gray-900
        disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-transparent
        transition-colors duration-100
    `;

    const buttons = [
        {
            label: "Previous page with issues",
            pageNumber: previousPageWithIssues,
            path: "M2 6.5L5 3.5L8 6.5",
            className: `${buttonClassNames} border-r border-gray-300`,
        },
        {
            label: "Next page with issues",
            pageNumber: nextPageWithIssues,
            path: "M2 3.5L5 6.5L8 3.5",
            className: buttonClassNames,
        },
    ];

    return (
        <div className="flex items-center gap-2.5 font-medium text-gray-700">
            <p className="text-sm tabular-nums">
                {currentPageHasIssues
                    ? `Issue ${aboveCount + 1} of ${pageNumbersWithIssues.length}`
                    : "Jump to issues"}
            </p>

            <div className="flex rounded-full border border-gray-300 overflow-hidden shadow-sm">
                {buttons.map(({label, pageNumber, path, className}) => (
                    <button
                        key={label}
                        onClick={() => pageNumber !== null && onNavigate(pageNumber)}
                        disabled={pageNumber === null}
                        aria-label={label}
                        className={className}
                    >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                            <path d={path} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
}
