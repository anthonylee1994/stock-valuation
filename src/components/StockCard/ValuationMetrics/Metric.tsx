import React from "react";

interface MetricProps {
    label: string;
    value: string;
    className?: string;
}

export const Metric = React.memo<MetricProps>(({label, value, className = "text-foreground"}) => (
    <div className="min-w-0 border-r border-b border-zinc-800 px-2.5 py-2 last:border-r-0 nth-[3n]:border-r-0">
        <span className="mb-1 block truncate text-[11px] font-bold text-zinc-400 uppercase">{label}</span>
        <span className={`block truncate text-xs font-black tabular-nums ${className}`}>{value}</span>
    </div>
));
