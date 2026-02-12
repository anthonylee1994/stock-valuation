import type {ValuationStatus} from "../../types";

export const STATUS_CONFIG: Record<ValuationStatus, {emoji: string; label: string; color: "success" | "warning" | "danger"}> = {
    undervalued: {emoji: "🟢", label: "低估", color: "success"},
    fair: {emoji: "🟡", label: "合理", color: "warning"},
    overvalued: {emoji: "🔴", label: "高估", color: "danger"},
};

export const getStatus = (currentPrice: number, low: number, high: number): ValuationStatus => {
    if (currentPrice < low) return "undervalued";
    if (currentPrice > high) return "overvalued";
    return "fair";
};

export const formatPrice = (value: number): string => {
    return "$" + value.toFixed(2);
};

export const formatPercent = (value: number, showSign: boolean): string => {
    const sign = showSign && value >= 0 ? "+" : "";
    return sign + value.toFixed(2) + "%";
};
