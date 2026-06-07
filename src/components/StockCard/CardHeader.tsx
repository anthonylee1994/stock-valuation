import React from "react";
import type {ValuationStatus} from "@/types";
import {STATUS_CONFIG} from "./constants";

interface Props {
    symbol: string;
    name: string | null;
    status: ValuationStatus;
}

export const CardHeader = React.memo<Props>(({symbol, name, status}) => {
    const config = STATUS_CONFIG[status];

    return (
        <div className="border-b border-black bg-[#2e2e2e] px-3 py-2">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h3 id={`card-title-${symbol}`} className="mt-1 min-w-0 truncate text-xl leading-none font-bold text-zinc-50">
                        {symbol}
                    </h3>
                    <p className="mt-1 truncate text-[12px] font-semibold text-zinc-400 uppercase">{name || symbol}</p>
                </div>
                <div
                    className={`relative top-1 flex shrink-0 items-center gap-1 rounded-[2px] px-2 py-1 text-[12px] font-bold uppercase ${config.chipBorderClass} ${config.chipBgClass} ${config.chipTextClass}`}
                >
                    <config.icon className="size-3" aria-hidden />
                    {config.label}
                </div>
            </div>
        </div>
    );
});
