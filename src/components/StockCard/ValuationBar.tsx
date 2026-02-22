import React from "react";
import {formatPrice} from "./constants";
import {calculateBarPositions} from "@/utils/valuationBar";

interface Props {
    price: number;
    valuationLow: number;
    valuationHigh: number;
}

export const ValuationBar = React.memo<Props>(({price, valuationLow, valuationHigh}) => {
    const {markerPosition, lowPosition, highPosition} = calculateBarPositions(price, valuationLow, valuationHigh);

    return (
        <div className="relative h-8 mb-10 rounded-full overflow-visible">
            <div className="absolute inset-0 flex rounded-full overflow-hidden shadow-inner ring-1 ring-black/5">
                <div className="h-full bg-[#00c755] transition-[width] duration-500 ease-in-out" style={{width: `${lowPosition}%`}} />
                <div className="h-full bg-[#e9b500] transition-[width] duration-500 ease-in-out" style={{width: `${highPosition - lowPosition}%`}} />
                <div className="h-full bg-[#f73232] flex-1 transition-[width] duration-500 ease-in-out" />
            </div>
            <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-0.5 h-10 bg-foreground z-2"
                style={{left: `${markerPosition}%`, transition: "left 500ms ease-in-out"}}
                title={formatPrice(price)}
            >
                <div className="absolute left-1/2 top-full translate-y-[-6px] -translate-x-1/2 flex flex-col items-center z-3">
                    <span className="text-[0.7rem] text-foreground leading-none">▼</span>
                    <span className="text-xs font-semibold text-foreground whitespace-nowrap mt-0.5 tabular-nums">{formatPrice(price)}</span>
                </div>
            </div>
        </div>
    );
});
