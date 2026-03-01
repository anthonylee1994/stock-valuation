import type {ValuationStatus} from "@/types";
import type {IconType} from "react-icons";
import {FiMinus, FiTrendingDown, FiTrendingUp} from "react-icons/fi";

export const STATUS_CONFIG: Record<
    ValuationStatus,
    {
        icon: IconType;
        label: string;
        color: "success" | "warning" | "danger";
        borderClass: string;
        bgClass: string;
        textClass: string;
    }
> = {
    undervalued: {
        icon: FiTrendingUp,
        label: "低估",
        color: "success",
        borderClass: "border-success/50",
        bgClass: "bg-success/10",
        textClass: "text-success",
    },
    fair: {
        icon: FiMinus,
        label: "合理",
        color: "warning",
        borderClass: "border-warning/50",
        bgClass: "bg-warning/10",
        textClass: "text-warning",
    },
    overvalued: {
        icon: FiTrendingDown,
        label: "高估",
        color: "danger",
        borderClass: "border-danger/50",
        bgClass: "bg-danger/10",
        textClass: "text-danger",
    },
};
