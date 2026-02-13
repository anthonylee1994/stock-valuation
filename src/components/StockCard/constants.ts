import type {ValuationStatus} from "../../types";

export const STATUS_CONFIG: Record<ValuationStatus, {emoji: string; label: string; color: "success" | "warning" | "danger"; borderClass: string}> = {
    undervalued: {emoji: "🟢", label: "低估", color: "success", borderClass: "border-green-500 shadow-green-500/15"},
    fair: {emoji: "🟡", label: "合理", color: "warning", borderClass: "border-yellow-500 shadow-yellow-500/15"},
    overvalued: {emoji: "🔴", label: "高估", color: "danger", borderClass: "border-red-500 shadow-red-500/15"},
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

export const calculatePotential = (price: number, target: number): number => {
    return price > 0 ? ((target - price) / price) * 100 : 0;
};

export const getPriceColor = (change: number) => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-slate-400";
};
