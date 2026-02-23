import React from "react";
import {formatPrice, formatPercent, calculatePotential} from "./constants";

interface Props {
    valuationLow: number;
    valuationHigh: number;
    forwardPE: number | null;
    priceToBook: number | null;
    dividendYield: number | null;
    price: number;
}

export const ValuationMetrics = React.memo<Props>(({valuationLow, valuationHigh, forwardPE, priceToBook, dividendYield, price}) => {
    const potentialDownside = calculatePotential(price, valuationLow);
    const potentialUpside = calculatePotential(price, valuationHigh);
    const downClass = potentialDownside > 0 ? "text-success" : "text-danger";
    const upClass = potentialUpside > 0 ? "text-success" : "text-danger";

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-2">
            <Metric label="預測市盈率" value={forwardPE ? forwardPE.toFixed(2) : "-"} />
            <Metric label="市淨率" value={priceToBook ? priceToBook.toFixed(2) : "-"} />
            <Metric label="股息率" value={dividendYield ? formatPercent(dividendYield, false) : "-"} />
            <Metric label="估值區間" value={`${formatPrice(valuationLow)} - ${formatPrice(valuationHigh)}`} />
            <Metric label="距離殘值" value={formatPercent(potentialDownside, true)} className={downClass} />
            <Metric label="距離極值" value={formatPercent(potentialUpside, true)} className={upClass} />
        </div>
    );
});

interface MetricProps {
    label: string;
    value: string;
    className?: string;
}

const Metric = React.memo<MetricProps>(({label, value, className = "text-foreground"}) => (
    <div>
        <span className="text-xs text-muted block mb-0.5">{label}</span>
        <span className={`text-sm font-semibold tabular-nums ${className}`}>{value}</span>
    </div>
));
