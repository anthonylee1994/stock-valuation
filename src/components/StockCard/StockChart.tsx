import React from "react";
import {ProgressCircle} from "@heroui/react";

interface Props {
    symbol: string;
}

export const StockChart = React.memo<Props>(({symbol}) => {
    const src = `https://charts2.finviz.com/chart.ashx?t=${symbol.toLocaleLowerCase()}`;
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
                className={`w-full border-none hue-rotate-180 invert ${isLoading ? "opacity-0" : ""}`}
                alt="Stock Chart"
                onLoad={() => setSettledSrc(src)}
                onError={() => setSettledSrc(src)}
            />
        </div>
    );
});
