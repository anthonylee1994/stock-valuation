import type {ValuationStatus} from "@/types";
import React from "react";
import {STATUS_CONFIG} from "./constants";

interface Props {
    symbol: string;
    name: string;
    status: ValuationStatus;
}

export const CardHeader = React.memo<Props>(({symbol, name, status}) => {
    const config = STATUS_CONFIG[status];

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3">
                <h3 id={`card-title-${symbol}`} className="text-xl font-bold tracking-tight text-foreground truncate min-w-0">
                    {symbol}
                </h3>
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 ${config.bgClass} ${config.textClass}`}>
                    <config.icon className="size-3.5" aria-hidden />
                    {config.label}
                </div>
            </div>
            <p className="text-sm text-muted truncate">{name}</p>
        </div>
    );
});
