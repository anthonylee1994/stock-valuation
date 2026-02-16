import type {IconType} from "react-icons";
import {FiTrendingDown, FiTrendingUp, FiMinus} from "react-icons/fi";
import type {ValuationStatus} from "../../types";

export const STATUS_CONFIG: Record<
    ValuationStatus,
    {
        icon: IconType;
        label: string;
        color: "success" | "warning" | "danger";
        borderClass: "border-success" | "border-warning" | "border-danger";
    }
> = {
    undervalued: {icon: FiTrendingUp, label: "低估", color: "success", borderClass: "border-success"},
    fair: {icon: FiMinus, label: "合理", color: "warning", borderClass: "border-warning"},
    overvalued: {icon: FiTrendingDown, label: "高估", color: "danger", borderClass: "border-danger"},
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
    if (change > 0) return "text-success";
    if (change < 0) return "text-danger";
    return "text-muted";
};
