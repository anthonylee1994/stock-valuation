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
        <div className="bg-[#141414] px-3 pt-3 pb-3">
            <div className="relative h-4 overflow-visible border border-zinc-700 bg-zinc-900">
                <div className="absolute inset-0 flex overflow-hidden">
                    <div className={`h-full bg-emerald-400 ${barTransition}`} style={{width: `${lowPosition}%`}} />
                    <div className={`h-full bg-amber-300 ${barTransition}`} style={{width: `${highPosition - lowPosition}%`}} />
                    <div className={`h-full flex-1 bg-rose-400 ${barTransition}`} />
                </div>

                <Tooltip delay={0} isOpen={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                    <div className={`absolute flex -translate-x-1/2 flex-col items-center ${markerTransition}`} style={{left: `${markerPosition}%`}}>
                        <Tooltip.Trigger
                            onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                            className="relative flex cursor-pointer flex-col items-center transition-transform duration-200 hover:scale-125 active:scale-125"
                        >
                            <div className="relative top-[-3px] z-10 h-5 w-1.5 bg-zinc-50 shadow-[0_0_0_2px_rgba(0,0,0,0.9)]" />
                        </Tooltip.Trigger>
                    </div>
                    <Tooltip.Content placement="bottom" className="rounded-[2px] bg-zinc-50 px-3 py-2 font-mono text-sm font-black text-zinc-950 shadow-xl">
                        ${formatPrice(price)}
                    </Tooltip.Content>
                </Tooltip>
            </div>

            <div className="mt-3 flex justify-between gap-3 text-[12px] font-bold uppercase">
                <span className="min-w-0 truncate text-zinc-400">
                    殘值：<span className="font-bold text-emerald-400">{formatPrice(valuationLow)}</span>
                </span>
                <span className="min-w-0 truncate text-zinc-400">
                    極值：<span className="font-bold text-rose-400">{formatPrice(valuationHigh)}</span>
                </span>
            </div>
        </div>
    );
});
