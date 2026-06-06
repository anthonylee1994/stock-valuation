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
        chipBorderClass: string;
        chipBgClass: string;
        chipTextClass: string;
    }
> = {
    undervalued: {
        icon: FiTrendingUp,
        label: "低估",
        color: "success",
        borderClass: "border-t-emerald-400",
        bgClass: "bg-emerald-400/10",
        textClass: "text-emerald-300",
        chipBorderClass: "border border-emerald-400/40",
        chipBgClass: "bg-emerald-400/10",
        chipTextClass: "text-emerald-300",
    },
    fair: {
        icon: FiMinus,
        label: "合理",
        color: "warning",
        borderClass: "border-t-amber-300",
        bgClass: "bg-amber-300/10",
        textClass: "text-amber-200",
        chipBorderClass: "border border-amber-300/40",
        chipBgClass: "bg-amber-300/10",
        chipTextClass: "text-amber-200",
    },
    overvalued: {
        icon: FiTrendingDown,
        label: "高估",
        color: "danger",
        borderClass: "border-t-rose-400",
        bgClass: "bg-rose-400/10",
        textClass: "text-rose-300",
        chipBorderClass: "border border-rose-400/40",
        chipBgClass: "bg-rose-400/10",
        chipTextClass: "text-rose-300",
    },
};
