import React from "react";

interface Props {
    label: string;
    value: string;
}

export const MetricRow = React.memo<Props>(({label, value}) => (
    <div className="flex justify-between items-center">
        <span className="text-[0.75rem] text-muted text-left min-w-15">{label}</span>
        <span className="text-[0.75rem] font-semibold text-foreground truncate">{value}</span>
    </div>
));
