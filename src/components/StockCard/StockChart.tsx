import React from "react";
import {ProgressCircle} from "@heroui/react";
import type {MarketFilter} from "@/types";

interface Props {
    symbol: string;
    market: MarketFilter;
}

export const StockChart = React.memo<Props>(({symbol, market}) => {
    const src =
        market === "us_market"
            ? `https://charts2.finviz.com/chart.ashx?t=${symbol.toLocaleLowerCase()}`
            : `https://charts.aastocks.com/servlet/Charts?fontsize=12&15MinDelay=T&lang=1&titlestyle=1&vol=1&Indicator=1&indpara1=10&indpara2=20&indpara3=50&indpara4=100&indpara5=150&scheme=3&com=100&chartwidth=466&chartheight=219&stockid=${symbol.toLocaleLowerCase()}&period=9&type=1&logoStyle=1`;
    // Track the src that has finished (or failed) loading, so a symbol change shows the spinner again
    const [settledSrc, setSettledSrc] = React.useState<string | null>(null);
    const isLoading = settledSrc !== src;

    return (
        <div className={`relative ${isLoading ? "min-h-46" : ""}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <ProgressCircle aria-label="Loading chart" isIndeterminate size="md" color="default">
                        <ProgressCircle.Track>
                            <ProgressCircle.TrackCircle />
                            <ProgressCircle.FillCircle />
                        </ProgressCircle.Track>
                    </ProgressCircle>
                </div>
            )}
            <img
                src={src}
                className={`w-full border-none ${market === "us_market" ? "hue-rotate-180 invert" : ""} ${isLoading ? "opacity-0" : ""}`}
                alt="Stock Chart"
                onLoad={() => setSettledSrc(src)}
                onError={() => setSettledSrc(src)}
            />
        </div>
    );
});
