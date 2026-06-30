interface IssueNavSummaryProps {
    currentPage: number;
    pageCount: number | null;
}

export function IssueNavSummary({currentPage, pageCount}: IssueNavSummaryProps) {
    if (pageCount === null) return null;

    return (
        <span className="font-medium text-sm">Page {currentPage} of {pageCount}</span>
    );
}
