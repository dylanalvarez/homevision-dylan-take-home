interface IssueNavSummaryProps {
    currentPage: number;
    pageCount: number | null;
}

export function IssueNavSummary({currentPage, pageCount}: IssueNavSummaryProps) {
    return (
        <span className="font-medium text-sm text-gray-700">Page {currentPage} of {pageCount}</span>
    );
}
