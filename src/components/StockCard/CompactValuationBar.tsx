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
        <div className="px-1 pt-1.5 pb-1">
            <div className="bg-surface/50 relative h-3.5 overflow-visible rounded-full shadow-inner">
                <div className="absolute inset-0 flex overflow-hidden rounded-full">
                    <div className={`h-full bg-linear-to-r from-emerald-400 to-emerald-500 ${barTransition}`} style={{width: `${lowPosition}%`}} />
                    <div className={`h-full bg-linear-to-r from-amber-400 to-amber-500 ${barTransition}`} style={{width: `${highPosition - lowPosition}%`}} />
                    <div className={`h-full flex-1 bg-linear-to-r from-rose-400 to-rose-500 ${barTransition}`} />
                </div>

                <Tooltip delay={0} isOpen={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                    <div className={`absolute flex -translate-x-1/2 flex-col items-center ${markerTransition}`} style={{left: `${markerPosition}%`}}>
                        <Tooltip.Trigger
                            onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                            className="relative flex cursor-pointer flex-col items-center transition-transform duration-200 hover:scale-125 active:scale-125"
                        >
                            <div className="bg-foreground ring-surface relative z-10 h-3.5 w-3.5 rounded-full shadow-lg ring-2" />
                        </Tooltip.Trigger>
                    </div>
                    <Tooltip.Content placement="bottom" className="bg-foreground text-surface rounded-lg px-3 py-2 text-sm font-bold shadow-xl">
                        ${formatPrice(price)}
                    </Tooltip.Content>
                </Tooltip>
            </div>

            <div className="mt-4 flex justify-between text-[11px]">
                <span className="text-muted font-medium">
                    殘值：<span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(valuationLow)}</span>
                </span>
                <span className="text-muted font-medium">
                    極值：<span className="font-bold text-rose-600 dark:text-rose-400">{formatPrice(valuationHigh)}</span>
                </span>
            </div>
        </div>
    );
});
