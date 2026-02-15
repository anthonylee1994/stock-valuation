interface Props {
    label: string;
    value: string;
}

export const MetricRow = ({label, value}: Props) => (
    <div className="flex justify-between items-center">
        <span className="text-[0.75rem] text-muted">{label}</span>
        <span className="text-[0.75rem] font-semibold text-foreground">{value}</span>
    </div>
);
