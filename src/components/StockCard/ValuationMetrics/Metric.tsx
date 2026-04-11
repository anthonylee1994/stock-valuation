import React from "react";

interface MetricProps {
    label: string;
    value: string;
    className?: string;
}

export const Metric = React.memo<MetricProps>(({label, value, className = "text-foreground"}) => (
    <div>
        <span className="text-muted mb-0.5 block text-[11px]">{label}</span>
        <span className={`text-xs font-semibold tabular-nums ${className}`}>{value}</span>
    </div>
));
