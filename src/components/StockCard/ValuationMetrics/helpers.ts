import type {ValuationMetricType} from "@/types";
import {formatPercent} from "@/utils/stockHelpers";

export function getMetricLabel(metric: ValuationMetricType) {
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

export function formatOptionalNumber(value: number | null) {
    return value == null ? "-" : value.toFixed(2);
}
export function formatOptionalPercent(value: number | null) {
    return value == null ? "-" : formatPercent(value, false);
}
