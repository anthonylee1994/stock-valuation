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
        <div className={`border-2 border-transparent bg-[#262626] px-3 pt-2 pb-3 ${flashClass}`}>
            <div className="flex items-baseline justify-between gap-2">
                <span className={`min-w-0 truncate text-[2rem] leading-none font-bold tabular-nums ${priceColor}`}>{formatPrice(price)}</span>
                <span className={`shrink-0 text-base ${arrowDirection === "up" ? "text-emerald-400" : arrowDirection === "down" ? "text-rose-400" : "text-zinc-400"}`} aria-label={ariaLabel}>
                    {arrowDirection === "up" ? <ImArrowUp aria-hidden /> : arrowDirection === "down" ? <ImArrowDown aria-hidden /> : <ImMinus aria-hidden />}
                </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-black pt-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase">最新 / 變動</span>
                <span className={`text-sm font-bold ${priceColor} tabular-nums`}>
                    {change > 0 ? "+" : ""}
                    {formatPrice(change)} {formatPercent(percentChange, true)}
                </span>
            </div>
        </div>
    );
});
