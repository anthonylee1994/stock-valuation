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
        <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between gap-2">
                <h3 id={`card-title-${symbol}`} className="text-lg font-bold tracking-tight text-foreground truncate min-w-0">
                    {symbol}
                </h3>
                <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shrink-0 ${config.chipBorderClass} ${config.chipBgClass} ${config.chipTextClass}`}>
                    <config.icon className="size-3" aria-hidden />
                    {config.label}
                </div>
            </div>
            <p className="text-xs text-muted truncate">{name || symbol}</p>
        </div>
    );
});
