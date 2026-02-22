import React from "react";
import {formatPrice} from "./constants";

interface Props {
    price: number;
    valuationLow: number;
    valuationHigh: number;
}

export const ValuationBar = React.memo<Props>(({price, valuationLow, valuationHigh}) => {
    const barMin = Math.min(valuationLow, price) * 0.9;
    const barMax = Math.max(valuationHigh, price) * 1.1;
    const barRange = barMax - barMin;
    const markerPosition = barRange > 0 ? ((price - barMin) / barRange) * 100 : 50;
    const lowPosition = barRange > 0 ? ((valuationLow - barMin) / barRange) * 100 : 0;
    const highPosition = barRange > 0 ? ((valuationHigh - barMin) / barRange) * 100 : 100;

    return (
        <div className="relative h-7 mb-9 rounded-full overflow-visible">
            {/* Three colored sections that transition their widths */}
            <div className="absolute inset-0 flex rounded-full overflow-hidden">
                {/* Green section (undervalued) */}
                <div className="h-full bg-[#00c755] transition-all duration-500 ease-in-out" style={{width: `${lowPosition}%`}} />
                {/* Yellow section (fair value range) */}
                <div className="h-full bg-[#e9b500] transition-all duration-500 ease-in-out" style={{width: `${highPosition - lowPosition}%`}} />
                {/* Red section (overvalued) */}
                <div className="h-full bg-[#f73232] transition-all duration-500 ease-in-out flex-1" />
            </div>
            {/* White marker line */}
            <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-9 bg-foreground z-[2]"
                style={{left: `${markerPosition}%`, transition: "left 500ms, color 100ms"}}
                title={formatPrice(price)}
            >
                <div className="absolute left-1/2 top-full translate-y-[-6px] -translate-x-1/2 flex flex-col items-center gap-0 transition-all duration-500 z-[3]">
                    <span className="text-[0.8rem] text-foreground">▼</span>
                    <span className="text-xs font-semibold text-foreground whitespace-nowrap mt-[-2px]">{formatPrice(price)}</span>
                </div>
            </div>
        </div>
    );
});
