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
        borderClass: "border-emerald-400/80 dark:border-emerald-600/60",
        bgClass: "bg-emerald-100 dark:bg-emerald-900/50",
        textClass: "text-emerald-800 dark:text-emerald-300",
        chipBorderClass: "border-dotted border-2 border-emerald-400/80 dark:border-emerald-600/60",
        chipBgClass: "bg-transparent",
        chipTextClass: "text-emerald-600 dark:text-emerald-400",
    },
    fair: {
        icon: FiMinus,
        label: "合理",
        color: "warning",
        borderClass: "border-amber-400/80 dark:border-amber-600/60",
        bgClass: "bg-amber-100 dark:bg-amber-900/50",
        textClass: "text-amber-800 dark:text-amber-300",
        chipBorderClass: "border-dotted border-2 border-amber-400/80 dark:border-amber-600/60",
        chipBgClass: "bg-transparent",
        chipTextClass: "text-amber-600 dark:text-amber-400",
    },
    overvalued: {
        icon: FiTrendingDown,
        label: "高估",
        color: "danger",
        borderClass: "border-rose-400/80 dark:border-rose-600/60",
        bgClass: "bg-rose-100 dark:bg-rose-900/50",
        textClass: "text-rose-800 dark:text-rose-300",
        chipBorderClass: "border-dotted border-2 border-rose-400/80 dark:border-rose-600/60",
        chipBgClass: "bg-transparent",
        chipTextClass: "text-rose-600 dark:text-rose-400",
    },
};
