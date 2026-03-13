import type {ValuationMetricType} from "@/types";
import {calculatePotential, formatPercent, formatPrice} from "@/utils/stockHelpers";
import React from "react";

interface Props {
    valuationLow: number;
    valuationHigh: number;
    metric: ValuationMetricType;
    base: number;
    lowMultiple: number;
    highMultiple: number;
    forwardPE: number | null;
    priceToBook: number | null;
    dividendYield: number | null;
    price: number;
}

export const ValuationMetrics = React.memo<Props>(({valuationLow, valuationHigh, metric, base, lowMultiple, highMultiple, forwardPE, priceToBook, dividendYield, price}) => {
    const potentialDownside = calculatePotential(price, valuationLow);
    const potentialUpside = calculatePotential(price, valuationHigh);
    const downClass = potentialDownside > 0 ? "text-success" : "text-danger";
    const upClass = potentialUpside > 0 ? "text-success" : "text-danger";

    return (
        <React.Fragment>
            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                <Metric label="預測市盈率" value={forwardPE ? forwardPE.toFixed(2) : "-"} />
                <Metric label="市淨率" value={priceToBook ? priceToBook.toFixed(2) : "-"} />
                <Metric label="股息率" value={dividendYield ? formatPercent(dividendYield, false) : "-"} />
                <hr className="col-span-3" />
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                <Metric label="估值模型" value={metric} />
                <Metric label={getMetricLabel(metric)} value={formatPrice(base)} />
                <hr className="col-span-3" />
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                <Metric label={metric === "股息率" ? "殘值息率" : "殘值倍數"} value={metric === "股息率" ? formatPercent(highMultiple * 100, false) : lowMultiple.toFixed(2)} />
                <Metric label="殘值" value={formatPrice(valuationLow)} />
                <Metric label="距離殘值" value={formatPercent(potentialDownside, true)} className={downClass} />

                <Metric label={metric === "股息率" ? "極值息率" : "極值倍數"} value={metric === "股息率" ? formatPercent(lowMultiple * 100, false) : highMultiple.toFixed(2)} />
                <Metric label="極值" value={formatPrice(valuationHigh)} />
                <Metric label="距離極值" value={formatPercent(potentialUpside, true)} className={upClass} />
            </div>
        </React.Fragment>
    );
});

function getMetricLabel(metric: ValuationMetricType) {
    switch (metric) {
        case "股息率":
            return "每股派息";
        case "P/E":
            return "每股盈利";
        case "P/S":
            return "每股營收";
        case "P/B":
            return "每股資產淨值";
        case "P/OCF":
            return "每股營業現金流";
    }
}

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
