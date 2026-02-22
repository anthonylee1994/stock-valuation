import React from "react";
import {formatPercent} from "./constants";

interface Props {
    potentialDownside: number;
    potentialUpside: number;
}

export const PotentialDisplay = React.memo<Props>(({potentialDownside, potentialUpside}) => {
    const downClass = potentialDownside > 0 ? "text-success" : "text-danger";
    const upClass = potentialUpside > 0 ? "text-success" : "text-danger";

    return (
        <div className="flex gap-3 flex-wrap mb-4">
            <div className="flex-1 min-w-0 bg-surface-secondary rounded-xl px-3 py-2.5 text-center ring-1 ring-black/5 shadow-sm">
                <span className="block text-[0.7rem] text-muted uppercase tracking-wider font-medium">距離殘值</span>
                <span className={`block text-[0.95rem] font-semibold tabular-nums mt-0.5 ${downClass}`}>{formatPercent(potentialDownside, true)}</span>
            </div>
            <div className="flex-1 min-w-0 bg-surface-secondary rounded-xl px-3 py-2.5 text-center ring-1 ring-black/5 shadow-sm">
                <span className="block text-[0.7rem] text-muted uppercase tracking-wider font-medium">距離極值</span>
                <span className={`block text-[0.95rem] font-semibold tabular-nums mt-0.5 ${upClass}`}>{formatPercent(potentialUpside, true)}</span>
            </div>
        </div>
    );
});
