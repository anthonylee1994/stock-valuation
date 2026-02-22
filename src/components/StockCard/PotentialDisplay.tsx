import React from "react";
import {formatPercent} from "./constants";

interface Props {
    potentialDownside: number;
    potentialUpside: number;
}

export const PotentialDisplay = React.memo<Props>(({potentialDownside, potentialUpside}) => {
    return (
        <div className="flex justify-between items-center text-[0.8rem] gap-3 flex-wrap">
            <span className={potentialDownside > 0 ? "text-success font-medium" : "text-danger font-medium"}>
                距離殘值 <span className="tabular-nums">{formatPercent(potentialDownside, true)}</span>
            </span>
            <span className={potentialUpside > 0 ? "text-success font-medium" : "text-danger font-medium"}>
                距離極值 <span className="tabular-nums">{formatPercent(potentialUpside, true)}</span>
            </span>
        </div>
    );
});
