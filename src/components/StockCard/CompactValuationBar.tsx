import React from "react";
import {formatPrice} from "@/utils/stockHelpers";
import {calculateBarPositions} from "@/utils/valuationBar";
import {Tooltip} from "@heroui/react";

interface Props {
    price: number;
    valuationLow: number;
    valuationHigh: number;
}

export const CompactValuationBar = React.memo<Props>(({price, valuationLow, valuationHigh}) => {
    const {markerPosition, lowPosition, highPosition} = calculateBarPositions(price, valuationLow, valuationHigh);
    const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);

    const barTransition = "transition-[width] duration-500 ease-in-out";
    const markerTransition = "transition-[left] duration-500 ease-in-out";

    return (
        <div className="px-1 py-2">
            <div className="relative h-4 rounded-full overflow-visible shadow-inner bg-surface/50">
                <div className="absolute inset-0 flex rounded-full overflow-hidden">
                    <div className={`h-full bg-linear-to-r from-emerald-400 to-emerald-500 ${barTransition}`} style={{width: `${lowPosition}%`}} />
                    <div className={`h-full bg-linear-to-r from-amber-400 to-amber-500 ${barTransition}`} style={{width: `${highPosition - lowPosition}%`}} />
                    <div className={`h-full bg-linear-to-r from-rose-400 to-rose-500 flex-1 ${barTransition}`} />
                </div>

                <Tooltip delay={0} isOpen={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                    <div className={`absolute -translate-x-1/2 flex flex-col items-center ${markerTransition}`} style={{left: `${markerPosition}%`}}>
                        <Tooltip.Trigger
                            onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                            className="relative flex flex-col items-center cursor-pointer hover:scale-125 active:scale-125 transition-transform duration-200"
                        >
                            <div className="relative w-4 h-4 rounded-full bg-foreground z-10 shadow-lg ring-2 ring-surface" />
                        </Tooltip.Trigger>
                    </div>
                    <Tooltip.Content placement="bottom" className="px-3 py-2 text-sm font-bold bg-foreground text-surface shadow-xl rounded-lg">
                        ${formatPrice(price)}
                    </Tooltip.Content>
                </Tooltip>
            </div>

            <div className="flex justify-between mt-5 text-xs">
                <span className="text-muted font-medium">
                    殘值：<span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatPrice(valuationLow)}</span>
                </span>
                <span className="text-muted font-medium">
                    極值：<span className="text-rose-600 dark:text-rose-400 font-bold">{formatPrice(valuationHigh)}</span>
                </span>
            </div>
        </div>
    );
});
