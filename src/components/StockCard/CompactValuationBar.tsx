import {calculateBarPositions} from "@/utils/valuationBar";
import {Tooltip} from "@heroui/react";
import React, {useState} from "react";
import {formatPrice} from "./constants";

interface Props {
    price: number;
    valuationLow: number;
    valuationHigh: number;
}

export const CompactValuationBar = React.memo<Props>(({price, valuationLow, valuationHigh}) => {
    const {markerPosition, lowPosition, highPosition} = calculateBarPositions(price, valuationLow, valuationHigh);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    const barTransition = "transition-[width] duration-500 ease-in-out";
    const markerTransition = "transition-[left] duration-500 ease-in-out";

    return (
        <div className="px-1 py-1">
            <div className="relative h-3 rounded-full overflow-visible shadow-inner bg-surface/50">
                <div className="absolute inset-0 flex rounded-full overflow-hidden">
                    <div className={`h-full bg-emerald-500 ${barTransition}`} style={{width: `${lowPosition}%`}} />
                    <div className={`h-full bg-yellow-500 ${barTransition}`} style={{width: `${highPosition - lowPosition}%`}} />
                    <div className={`h-full bg-red-500 flex-1 ${barTransition}`} />
                </div>

                <Tooltip delay={0} isOpen={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                    <div className={`absolute -translate-x-1/2 flex flex-col items-center ${markerTransition}`} style={{left: `${markerPosition}%`}}>
                        <Tooltip.Trigger
                            onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                            className="relative flex flex-col items-center cursor-pointer hover:scale-140 active:scale-140 transition-transform"
                        >
                            <div className="relative w-3 h-3 rounded-full bg-foreground z-10" />
                        </Tooltip.Trigger>
                    </div>
                    <Tooltip.Content placement="bottom" className="px-3 py-1.5 text-sm font-semibold bg-foreground text-surface shadow-xl">
                        ${formatPrice(price)}
                    </Tooltip.Content>
                </Tooltip>
            </div>

            <div className="flex justify-between mt-4 text-xs">
                <span className="text-muted font-medium">
                    殘值：<span className="text-success font-semibold">{formatPrice(valuationLow)}</span>
                </span>
                <span className="text-muted font-medium">
                    極值：<span className="text-danger font-semibold">{formatPrice(valuationHigh)}</span>
                </span>
            </div>
        </div>
    );
});
