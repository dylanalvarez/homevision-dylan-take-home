import {AlertCircle, AlertTriangle, Info} from 'lucide-react';

export type Issues = {
    critical?: string[];
    major?: string[];
    minor?: string[];
}

interface PageIssuesProps {
    issues: Issues;
}

const SEVERITY_ORDER: Array<keyof Issues> = ['critical', 'major', 'minor'];

const severityConfig = {
    critical: {
        label: 'Critical',
        Icon: AlertCircle,
        accentBg: 'bg-red-500',
        sectionBg: 'bg-red-50',
        iconCls: 'text-red-500',
        labelCls: 'text-red-700',
        dot: 'bg-red-400',
    },
    major: {
        label: 'Major',
        Icon: AlertTriangle,
        accentBg: 'bg-amber-400',
        sectionBg: 'bg-amber-50',
        iconCls: 'text-amber-500',
        labelCls: 'text-amber-700',
        dot: 'bg-amber-400',
    },
    minor: {
        label: 'Minor',
        Icon: Info,
        accentBg: 'bg-slate-400',
        sectionBg: 'bg-slate-50',
        iconCls: 'text-slate-400',
        labelCls: 'text-slate-600',
        dot: 'bg-slate-300',
    },
} as const;

export function PageIssues({issues}: PageIssuesProps) {
    const severitiesWithIssues = SEVERITY_ORDER.filter(s => issues[s]?.length);
    if (!severitiesWithIssues.length) return null;

    return (
        <div
            className="p-3 sm:px-14 md:px-18 sm:pt-6 md:pt-9 flex flex-col gap-2"
            role="region"
        >
            {severitiesWithIssues.map((severity) => {
                const {label, Icon, accentBg, sectionBg, iconCls, labelCls, dot} = severityConfig[severity];
                const messages = issues[severity] || [];

                return (
                    <div
                        key={severity}
                        className={`flex rounded-lg overflow-hidden border border-gray-200 ${sectionBg} shadow-sm`}
                    >
                        <div className={`w-1 shrink-0 ${accentBg}`} aria-hidden="true"/>
                        <div className="flex-1 px-3 py-2.5">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Icon className={`w-3.5 h-3.5 shrink-0 ${iconCls}`} aria-hidden="true"/>
                                <span className={`text-xs font-semibold ${labelCls}`}>{label}</span>
                            </div>
                            <ul className="space-y-1.5" role="list">
                                {messages.map((msg, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`}
                                              aria-hidden="true"/>
                                        <span className="text-sm text-gray-700 leading-snug">{msg}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}