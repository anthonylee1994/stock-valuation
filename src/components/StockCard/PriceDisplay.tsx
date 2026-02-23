import React from "react";
import {formatPrice, formatPercent, getPriceColor} from "./constants";
import {usePriceAnimation} from "@/hooks/usePriceAnimation";
import {ImArrowUp, ImArrowDown, ImMinus} from "react-icons/im";

interface Props {
    price: number;
    change: number;
    percentChange: number;
}

export const PriceDisplay = React.memo<Props>(({price, change, percentChange}) => {
    const {flashClass} = usePriceAnimation(price);
    const priceColor = getPriceColor(change);
    const arrowDirection = change > 0 ? "up" : change < 0 ? "down" : null;

    return (
        <div className={`flex flex-col gap-0.5 px-2 py-1 -mx-2 -my-1 rounded-lg border-2 border-transparent ${flashClass}`}>
            <div className="flex items-center gap-1">
                <span className={`text-3xl font-bold tracking-tight tabular-nums ${priceColor}`}>{formatPrice(price)}</span>
                {arrowDirection && (
                    <span className={`text-lg shrink-0 ${arrowDirection === "up" ? "text-success" : arrowDirection === "down" ? "text-danger" : "text-muted"}`}>
                        {arrowDirection === "up" ? <ImArrowUp aria-hidden /> : arrowDirection === "down" ? <ImArrowDown aria-hidden /> : <ImMinus aria-hidden />}
                    </span>
                )}
            </div>
            <span className={`text-sm font-medium ${priceColor} tabular-nums`}>
                {change > 0 ? "+" : ""}
                {formatPrice(change)} {formatPercent(percentChange, true)}
            </span>
        </div>
    );
});
