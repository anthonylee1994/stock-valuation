import React from "react";
import {formatPrice} from "./constants";

interface Props {
    valuationLow: number;
    valuationHigh: number;
}

export const ValuationRangeDisplay = ({valuationLow, valuationHigh}: Props) => {
    return (
        <React.Fragment>
            <div className="bg-slate-950/60 rounded-lg px-3 py-2 text-center">
                <span className="block text-[0.7rem] text-slate-400 uppercase tracking-wider">殘值</span>
                <span className="block text-[0.95rem] font-semibold text-slate-200 mt-1">{formatPrice(valuationLow)}</span>
            </div>
            <div className="bg-slate-950/60 rounded-lg px-3 py-2 text-center">
                <span className="block text-[0.7rem] text-slate-400 uppercase tracking-wider">極值</span>
                <span className="block text-[0.95rem] font-semibold text-slate-200 mt-1">{formatPrice(valuationHigh)}</span>
            </div>
        </React.Fragment>
    );
};
