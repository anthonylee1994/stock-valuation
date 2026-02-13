interface Props {
    label: string;
    value: string;
}

export const MetricRow = ({label, value}: Props) => (
    <div className="flex justify-between items-center">
        <span className="text-[0.75rem] text-slate-400">{label}</span>
        <span className="text-[0.9rem] font-semibold text-slate-200">{value}</span>
    </div>
);
