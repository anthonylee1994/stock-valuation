import type {ValuationMetricType} from "@/types";
import {formatPercent, formatPrice} from "@/utils/stockHelpers";
import React from "react";
import {Metric} from "./Metric";
import {formatOptionalNumber, formatOptionalPercent, getMetricLabel} from "./helpers";

interface Props {
    valuationLow: number;
    valuationHigh: number;
    potentialDownside: number;
    potentialUpside: number;
    metric: ValuationMetricType;
    base: number;
    lowMultiple: number;
    highMultiple: number;
    forwardPE: number | null;
    priceToBook: number | null;
    dividendYield: number | null;
    price: number;
}

export const ValuationMetrics = React.memo<Props>(
    ({valuationLow, valuationHigh, potentialDownside, potentialUpside, metric, base, lowMultiple, highMultiple, forwardPE, priceToBook, dividendYield}) => {
        const downClass = potentialDownside > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
        const upClass = potentialUpside > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
        const isDividendMetric = metric === "股息率";

        return (
            <React.Fragment>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <Metric label="預測市盈率" value={formatOptionalNumber(forwardPE)} />
                    <Metric label="市淨率" value={formatOptionalNumber(priceToBook)} />
                    <Metric label="股息率" value={formatOptionalPercent(dividendYield)} />
                    <hr className="col-span-3" />
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <Metric label="估值模型" value={metric} />
                    <Metric label={getMetricLabel(metric)} value={formatPrice(base)} />
                    <hr className="col-span-3" />
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <Metric label={isDividendMetric ? "殘值息率" : "殘值倍數"} value={isDividendMetric ? formatPercent(highMultiple * 100, false) : lowMultiple.toFixed(2)} />
                    <Metric label="殘值" value={formatPrice(valuationLow)} />
                    <Metric label="距離殘值" value={formatPercent(potentialDownside, true)} className={downClass} />

                    <Metric label={isDividendMetric ? "極值息率" : "極值倍數"} value={isDividendMetric ? formatPercent(lowMultiple * 100, false) : highMultiple.toFixed(2)} />
                    <Metric label="極值" value={formatPrice(valuationHigh)} />
                    <Metric label="距離極值" value={formatPercent(potentialUpside, true)} className={upClass} />
                </div>
            </React.Fragment>
        );
    }
);
