import React from "react";
import {formatPrice} from "./constants";
import {calculateBarPositions} from "@/utils/valuationBar";

interface Props {
    price: number;
    valuationLow: number;
    valuationHigh: number;
}

export const CompactValuationBar = React.memo<Props>(({price, valuationLow, valuationHigh}) => {
    const {markerPosition, lowPosition, highPosition} = calculateBarPositions(price, valuationLow, valuationHigh);

    return (
        <div>
            <div className="relative h-2 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex rounded-full">
                    <div className="h-full bg-success transition-[width] duration-500 ease-in-out" style={{width: `${lowPosition}%`}} />
                    <div className="h-full bg-warning transition-[width] duration-500 ease-in-out" style={{width: `${highPosition - lowPosition}%`}} />
                    <div className="h-full bg-danger flex-1 transition-[width] duration-500 ease-in-out" />
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-3 bg-foreground rounded-full" style={{left: `${markerPosition}%`, transition: "left 500ms ease-in-out"}} />
            </div>
            <div className="flex justify-between mt-3 text-xs text-muted">
                <span>殘值: {formatPrice(valuationLow)}</span>
                <span>現價: {formatPrice(price)}</span>
                <span>極值: {formatPrice(valuationHigh)}</span>
            </div>
        </div>
    );
});
