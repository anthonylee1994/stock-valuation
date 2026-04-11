import React from "react";
import {usePriceAnimation} from "@/hooks/usePriceAnimation";
import {formatPercent, formatPrice, getPriceColor} from "@/utils/stockHelpers";
import {ImArrowDown, ImArrowUp, ImMinus} from "react-icons/im";

interface Props {
    price: number;
    change: number;
    percentChange: number;
}

export const PriceDisplay = React.memo<Props>(({price, change, percentChange}) => {
    const {flashClass} = usePriceAnimation(price);
    const priceColor = getPriceColor(change);
    const arrowDirection = change > 0 ? "up" : change < 0 ? "down" : null;
    const ariaLabel = change > 0 ? "價格上升" : change < 0 ? "價格下跌" : "價格不變";

    return (
        <div className={`-mx-1.5 -my-1 flex flex-col gap-0.5 rounded-lg border-2 border-transparent px-1.5 py-1 ${flashClass}`}>
            <div className="flex items-center gap-1">
                <span className={`text-[1.75rem] font-bold tracking-tight tabular-nums ${priceColor}`}>{formatPrice(price)}</span>

                <span
                    className={`shrink-0 text-base ${arrowDirection === "up" ? "text-emerald-600 dark:text-emerald-400" : arrowDirection === "down" ? "text-rose-600 dark:text-rose-400" : "text-muted"}`}
                    aria-label={ariaLabel}
                >
                    {arrowDirection === "up" ? <ImArrowUp aria-hidden /> : arrowDirection === "down" ? <ImArrowDown aria-hidden /> : <ImMinus aria-hidden />}
                </span>
            </div>
            <span className={`text-xs font-medium ${priceColor} tabular-nums`}>
                {change > 0 ? "+" : ""}
                {formatPrice(change)} {formatPercent(percentChange, true)}
            </span>
        </div>
    );
});
