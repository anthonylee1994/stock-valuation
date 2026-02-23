import React from "react";
import {STATUS_CONFIG, getStatus} from "./constants";

interface Props {
    symbol: string;
    name: string;
    price: number;
    valuationLow: number;
    valuationHigh: number;
}

export const CardHeader = React.memo<Props>(({symbol, name, price, valuationLow, valuationHigh}) => {
    const status = getStatus(price, valuationLow, valuationHigh);
    const config = STATUS_CONFIG[status];

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3">
                <h3 id={`card-title-${symbol}`} className="text-xl font-bold tracking-tight text-foreground truncate min-w-0">
                    {symbol}
                </h3>
                <div
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 ${
                        config.color === "success" ? "bg-success/10 text-success" : config.color === "warning" ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                    }`}
                >
                    <config.icon className="size-3.5" aria-hidden />
                    {config.label}
                </div>
            </div>
            <p className="text-sm text-muted truncate">{name}</p>
        </div>
    );
});
