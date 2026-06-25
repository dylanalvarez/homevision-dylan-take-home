export type Issues = {
    critical?: string[];
    major?: string[];
    minor?: string[];
}

interface PageIssuesProps {
    issues: Issues;
}

const severityColors: Record<string, string> = {
    critical: "text-red-600",
    major: "text-yellow-600",
    minor: "text-gray-600",
};

export function PageIssues({issues}: PageIssuesProps) {
    return (
        <div className="space-y-4 bg-gray-200">
            {Object.entries(issues).map(([severity, messages]) => {
                if (!messages.length) return null;

                return (
                    <div key={severity} className={severityColors[severity]}>
                        <h4 className="capitalize font-bold text-sm">{severity}</h4>
                        <ul className="list-disc pl-4">
                            {messages.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}
