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
        borderClass: "border-emerald-200/60 dark:border-emerald-800/40 hover:border-emerald-300/80 dark:hover:border-emerald-700/60",
        bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
        textClass: "text-emerald-700 dark:text-emerald-400",
    },
    fair: {
        icon: FiMinus,
        label: "合理",
        color: "warning",
        borderClass: "border-amber-200/60 dark:border-amber-800/40 hover:border-amber-300/80 dark:hover:border-amber-700/60",
        bgClass: "bg-amber-50 dark:bg-amber-950/30",
        textClass: "text-amber-700 dark:text-amber-400",
    },
    overvalued: {
        icon: FiTrendingDown,
        label: "高估",
        color: "danger",
        borderClass: "border-rose-200/60 dark:border-rose-800/40 hover:border-rose-300/80 dark:hover:border-rose-700/60",
        bgClass: "bg-rose-50 dark:bg-rose-950/30",
        textClass: "text-rose-700 dark:text-rose-400",
    },
};
