import React, {useState} from "react";
import {formatPrice} from "./constants";
import {calculateBarPositions} from "@/utils/valuationBar";
import {Tooltip} from "@heroui/react";

interface Props {
    price: number;
    valuationLow: number;
    valuationHigh: number;
}

export const CompactValuationBar = React.memo<Props>(({price, valuationLow, valuationHigh}) => {
    const {markerPosition, lowPosition, highPosition} = calculateBarPositions(price, valuationLow, valuationHigh);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    return (
        <div>
            <div className="relative h-2 rounded-full overflow-visible">
                <div className="absolute inset-0 flex rounded-full overflow-hidden">
                    <div className="h-full bg-success transition-[width] duration-500 ease-in-out" style={{width: `${lowPosition}%`}} />
                    <div className="h-full bg-warning transition-[width] duration-500 ease-in-out" style={{width: `${highPosition - lowPosition}%`}} />
                    <div className="h-full bg-danger flex-1 transition-[width] duration-500 ease-in-out" />
                </div>
                <Tooltip delay={0} isOpen={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{left: `${markerPosition}%`, transition: "left 500ms ease-in-out"}}>
                        <Tooltip.Trigger onClick={() => setIsTooltipOpen(!isTooltipOpen)} className="absolute -top-0.5 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-foreground shrink-0" />
                            <div className="w-0.5 h-5 bg-foreground -mt-1.5" />
                        </Tooltip.Trigger>
                    </div>
                    <Tooltip.Content placement="bottom">
                        <Tooltip.Arrow />
                        {formatPrice(price)}
                    </Tooltip.Content>
                </Tooltip>
            </div>
            <div className="flex justify-between mt-5 text-xs text-muted">
                <span>殘值: {formatPrice(valuationLow)}</span>
                <span>現價: {formatPrice(price)}</span>
                <span>極值: {formatPrice(valuationHigh)}</span>
            </div>
        </div>
    );
});
