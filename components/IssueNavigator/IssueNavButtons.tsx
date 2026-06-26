import React from "react";
import {ChevronDown, ChevronUp} from "lucide-react";

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
        text-white/80 cursor-pointer
        hover:bg-white/20 hover:text-white
        active:bg-white/30 active:text-white
        disabled:text-white/30 disabled:cursor-not-allowed disabled:bg-transparent
        transition-colors duration-100
    `;

    const buttons = [
        {
            label: "Previous page with issues",
            pageNumber: previousPageWithIssues,
            icon: <ChevronUp size={12} strokeWidth={2.5} aria-hidden="true"/>,
            className: `${buttonClassNames} border-r border-white/30`,
        },
        {
            label: "Next page with issues",
            pageNumber: nextPageWithIssues,
            icon: <ChevronDown size={12} strokeWidth={2.5} aria-hidden="true"/>,
            className: buttonClassNames,
        },
    ];

    return (
        <div className="flex items-center gap-2.5 font-medium">
            <p className="text-sm tabular-nums text-white/90">
                {currentPageHasIssues
                    ? `Issue ${aboveCount + 1} of ${pageNumbersWithIssues.length}`
                    : "Jump to issues"}
            </p>
            <div className="flex rounded-full border border-white/30 overflow-hidden shadow-sm">
                {buttons.map(({label, pageNumber, icon, className}) => (
                    <button
                        key={label}
                        onClick={() => pageNumber !== null && onNavigate(pageNumber)}
                        disabled={pageNumber === null}
                        aria-label={label}
                        className={className}
                    >
                        {icon}
                    </button>
                ))}
            </div>
        </div>
    );
}