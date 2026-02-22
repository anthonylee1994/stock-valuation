import React from "react";
import {formatPrice} from "./constants";

interface Props {
    valuationLow: number;
    valuationHigh: number;
}

export const ValuationRangeDisplay = React.memo<Props>(({valuationLow, valuationHigh}) => {
    return (
        <React.Fragment>
            <div className="bg-surface-secondary rounded-xl px-3 py-2.5 text-center ring-1 ring-black/5 shadow-sm">
                <span className="block text-[0.7rem] text-muted uppercase tracking-wider font-medium">殘值</span>
                <span className="block text-[0.95rem] font-semibold text-foreground mt-1 tabular-nums">{formatPrice(valuationLow)}</span>
            </div>
            <div className="bg-surface-secondary rounded-xl px-3 py-2.5 text-center ring-1 ring-black/5 shadow-sm">
                <span className="block text-[0.7rem] text-muted uppercase tracking-wider font-medium">極值</span>
                <span className="block text-[0.95rem] font-semibold text-foreground mt-1 tabular-nums">{formatPrice(valuationHigh)}</span>
            </div>
        </React.Fragment>
    );
});
