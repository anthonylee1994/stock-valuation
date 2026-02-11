import {Card, Chip} from "@heroui/react";
import {useEffect, useRef, useState} from "react";
import type {StockWithQuote, ValuationStatus} from "../types";

const STATUS_CONFIG: Record<ValuationStatus, {emoji: string; label: string; color: "success" | "warning" | "danger"}> = {
    undervalued: {emoji: "🟢", label: "低估", color: "success"},
    fair: {emoji: "🟡", label: "合理", color: "warning"},
    overvalued: {emoji: "🔴", label: "高估", color: "danger"},
};

const getStatus = (currentPrice: number, low: number, high: number): ValuationStatus => {
    if (currentPrice < low) return "undervalued";
    if (currentPrice > high) return "overvalued";
    return "fair";
};

const formatPrice = (value: number): string => {
    return "$" + value.toFixed(2);
};

const formatPercent = (value: number): string => {
    const sign = value >= 0 ? "+" : "";
    return sign + value.toFixed(2) + "%";
};

interface Props {
    stock: StockWithQuote;
}

export const StockCard = ({stock}: Props) => {
    const {
        symbol,
        currentPrice,
        preMarketPrice,
        change: currentChange,
        percentChange: currentPercentChange,
        preMarketChange,
        preMarketChangePercent,
        postMarketChange,
        postMarketChangePercent,
        postMarketPrice,
        valuationLow,
        valuationHigh,
    } = stock;
    const price = typeof preMarketPrice !== "undefined" ? preMarketPrice : typeof postMarketPrice !== "undefined" ? postMarketPrice : currentPrice;
    const change = typeof preMarketChange !== "undefined" ? preMarketChange : typeof postMarketChange !== "undefined" ? postMarketChange : currentChange;
    const percentChange = typeof preMarketChangePercent !== "undefined" ? preMarketChangePercent : typeof postMarketChangePercent !== "undefined" ? postMarketChangePercent : currentPercentChange;
    const status = getStatus(price, valuationLow, valuationHigh);
    const config = STATUS_CONFIG[status];

    // Price flash animation state
    const prevPriceRef = useRef<number>(price);
    const [flashClass, setFlashClass] = useState<string>("");

    useEffect(() => {
        const prevPrice = prevPriceRef.current;

        if (prevPrice !== price) {
            // Determine flash color based on price direction
            const isIncrease = price > prevPrice;
            setFlashClass(isIncrease ? "flash-green" : "flash-red");

            // Remove flash class after animation completes
            const timer = setTimeout(() => setFlashClass(""), 600);

            // Update previous price
            prevPriceRef.current = price;

            return () => clearTimeout(timer);
        }
    }, [price]);

    const barMin = Math.min(valuationLow, price) * 0.9;
    const barMax = Math.max(valuationHigh, price) * 1.1;
    const barRange = barMax - barMin;
    const markerPosition = barRange > 0 ? ((price - barMin) / barRange) * 100 : 50;
    const lowPosition = barRange > 0 ? ((valuationLow - barMin) / barRange) * 100 : 0;
    const highPosition = barRange > 0 ? ((valuationHigh - barMin) / barRange) * 100 : 100;

    const potentialDownside = price > 0 ? -1 * ((price - valuationLow) / price) * 100 : 0;
    const potentialUpside = price > 0 ? ((valuationHigh - price) / price) * 100 : 0;

    const borderClass = status === "undervalued" ? "border-green-500 shadow-green-500/15" : status === "overvalued" ? "border-red-500 shadow-red-500/15" : "border-yellow-500 shadow-yellow-500/15";

    return (
        <Card className={`bg-gradient-to-br from-slate-800 to-slate-950 border-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-500 ${borderClass}`}>
            <Card.Header className="flex flex-row items-center justify-between">
                <h2 className="m-0 text-2xl font-bold text-slate-100 tracking-wide max-[480px]:text-xl">{symbol}</h2>
                <Chip color={config.color} variant="soft" size="sm">
                    {config.emoji} {config.label}
                </Chip>
            </Card.Header>

            <Card.Content>
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className={`col-span-2 bg-slate-950/60 rounded-lg px-3 py-2 text-center transition-all duration-150 border-2 border-transparent ${flashClass}`}>
                        <span className="block text-[0.7rem] text-slate-400 uppercase tracking-wider">現價</span>
                        <div className="mt-1 flex items-center justify-center flex-col">
                            <div className="flex items-center gap-2">
                                {change > 0 && <span className="text-green-400 text-[1.2rem]">▲</span>}
                                {change < 0 && <span className="text-red-400 text-[1.2rem]">▼</span>}
                                <div className={`text-[1.5rem] font-semibold ${change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-slate-400"}`}>{formatPrice(price)}</div>
                            </div>
                            <div className={`text-[1rem] font-medium ${change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-slate-400"}`}>
                                {formatPrice(change)} ({formatPercent(percentChange)})
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-950/60 rounded-lg px-3 py-2 text-center">
                        <span className="block text-[0.7rem] text-slate-400 uppercase tracking-wider">估值下限</span>
                        <span className="block text-[0.95rem] font-semibold text-slate-200 mt-1">{formatPrice(valuationLow)}</span>
                    </div>
                    <div className="bg-slate-950/60 rounded-lg px-3 py-2 text-center">
                        <span className="block text-[0.7rem] text-slate-400 uppercase tracking-wider">估值上限</span>
                        <span className="block text-[0.95rem] font-semibold text-slate-200 mt-1">{formatPrice(valuationHigh)}</span>
                    </div>
                </div>

                <div className="relative h-7 mb-10 rounded-full overflow-visible">
                    {/* Three colored sections that transition their widths */}
                    <div className="absolute inset-0 flex rounded-full overflow-hidden">
                        {/* Green section (undervalued) */}
                        <div className="h-full bg-[#00c755] transition-all duration-500 ease-in-out" style={{width: `${lowPosition}%`}} />
                        {/* Yellow section (fair value range) */}
                        <div className="h-full bg-[#e9b500] transition-all duration-500 ease-in-out" style={{width: `${highPosition - lowPosition}%`}} />
                        {/* Red section (overvalued) */}
                        <div className="h-full bg-[#f73232] transition-all duration-500 ease-in-out flex-1" />
                    </div>
                    {/* White marker line */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-9 bg-white rounded-sm shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-all duration-500 z-[2]"
                        style={{left: `${markerPosition}%`}}
                        title={formatPrice(currentPrice)}
                    />
                    {/* Arrow and price label */}
                    <div className="absolute top-full translate-y-1 -translate-x-1/2 flex flex-col items-center gap-0 transition-all duration-500 z-[3]" style={{left: `${markerPosition}%`}}>
                        <span className="text-[0.65rem] text-white [text-shadow:0_0_8px_rgba(255,255,255,0.9)]">▼</span>
                        <span className="text-xs font-semibold text-slate-100 whitespace-nowrap">{formatPrice(currentPrice)}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center text-[0.8rem] gap-2 flex-wrap">
                    <span className={`transition-colors duration-300 ${potentialDownside > 0 ? "text-green-500" : "text-red-500"}`}>距估值底部 {formatPercent(potentialDownside)}</span>
                    <span className={`transition-colors duration-300 ${potentialUpside > 0 ? "text-green-500" : "text-red-500"}`}>距估值頂部 {formatPercent(potentialUpside)}</span>
                </div>
            </Card.Content>
        </Card>
    );
};
