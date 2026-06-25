interface IssueNavSummaryProps {
    currentPage: number;
    pageCount: number | null;
}

export function IssueNavSummary({currentPage, pageCount}: IssueNavSummaryProps) {
    return (
        <span className="font-medium text-gray-800">Page {currentPage} of {pageCount}</span>
    );
}
