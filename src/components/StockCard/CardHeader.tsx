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
                <h3 id={`card-title-${symbol}`} className="text-foreground min-w-0 truncate text-lg font-bold tracking-tight">
                    {symbol}
                </h3>
                <div className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${config.chipBorderClass} ${config.chipBgClass} ${config.chipTextClass}`}>
                    <config.icon className="size-3" aria-hidden />
                    {config.label}
                </div>
            </div>
            <p className="text-muted truncate text-xs">{name || symbol}</p>
        </div>
    );
});
