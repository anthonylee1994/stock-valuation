import type {StockWithQuote, ValuationStatus} from "../types";

const STATUS_CONFIG: Record<ValuationStatus, {emoji: string; label: string; borderColor: string; shadowColor: string}> = {
    undervalued: {emoji: "🟢", label: "低估", borderColor: "border-green-500", shadowColor: "shadow-green-500/15"},
    fair: {emoji: "🟡", label: "合理", borderColor: "border-yellow-500", shadowColor: "shadow-yellow-500/15"},
    overvalued: {emoji: "🔴", label: "高估", borderColor: "border-red-500", shadowColor: "shadow-red-500/15"},
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
    const {symbol, currentPrice, valuationLow, valuationHigh} = stock;
    const status = getStatus(currentPrice, valuationLow, valuationHigh);
    const config = STATUS_CONFIG[status];

    const barMin = Math.min(valuationLow, currentPrice) * 0.9;
    const barMax = Math.max(valuationHigh, currentPrice) * 1.1;
    const barRange = barMax - barMin;
    const markerPosition = barRange > 0 ? ((currentPrice - barMin) / barRange) * 100 : 50;
    const lowPosition = barRange > 0 ? ((valuationLow - barMin) / barRange) * 100 : 0;
    const highPosition = barRange > 0 ? ((valuationHigh - barMin) / barRange) * 100 : 100;

    const potentialDownside = currentPrice > 0 ? -1 * ((currentPrice - valuationLow) / currentPrice) * 100 : 0;
    const potentialUpside = currentPrice > 0 ? ((valuationHigh - currentPrice) / currentPrice) * 100 : 0;

    return (
        <article
            className={`bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-2 ${config.borderColor} ${config.shadowColor} transition-all duration-500`}
        >
            <header className="flex items-center justify-between mb-4">
                <h2 className="m-0 text-2xl font-bold text-slate-100 tracking-wide max-[480px]:text-xl">{symbol}</h2>
                <span className="text-sm text-slate-300">
                    {config.emoji} {config.label}
                </span>
            </header>

            <div className="grid grid-cols-3 gap-3 mb-5 max-[480px]:grid-cols-1">
                <div className="bg-slate-950/60 rounded-lg px-3 py-2 text-center">
                    <span className="block text-[0.7rem] text-slate-400 uppercase tracking-wider">現價</span>
                    <span className="text-[0.95rem] font-semibold text-slate-200">{formatPrice(currentPrice)}</span>
                </div>
                <div className="bg-slate-950/60 rounded-lg px-3 py-2 text-center">
                    <span className="block text-[0.7rem] text-slate-400 uppercase tracking-wider">估值下限</span>
                    <span className="text-[0.95rem] font-semibold text-slate-200">{formatPrice(valuationLow)}</span>
                </div>
                <div className="bg-slate-950/60 rounded-lg px-3 py-2 text-center">
                    <span className="block text-[0.7rem] text-slate-400 uppercase tracking-wider">估值上限</span>
                    <span className="text-[0.95rem] font-semibold text-slate-200">{formatPrice(valuationHigh)}</span>
                </div>
            </div>

            <div className="relative h-7 mb-10 rounded-md overflow-visible">
                <div
                    className="absolute inset-0 rounded-md opacity-85 transition-all duration-500"
                    style={{
                        background: `linear-gradient(to right,
                            #22c55e 0%,
                            #22c55e ${lowPosition}%,
                            #eab308 ${lowPosition}%,
                            #eab308 ${highPosition}%,
                            #ef4444 ${highPosition}%,
                            #ef4444 100%)`,
                    }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-9 bg-white rounded-sm shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-all duration-500 z-[2]"
                    style={{left: `${markerPosition}%`}}
                    title={formatPrice(currentPrice)}
                />
                <div className="absolute top-full translate-y-1 -translate-x-1/2 flex flex-col items-center gap-0 transition-all duration-500 z-[3]" style={{left: `${markerPosition}%`}}>
                    <span className="text-[0.65rem] text-white [text-shadow:0_0_8px_rgba(255,255,255,0.9)]">▼</span>
                    <span className="text-xs font-semibold text-slate-100 whitespace-nowrap">{formatPrice(currentPrice)}</span>
                </div>
            </div>

            <div className="flex justify-between items-center text-[0.8rem] gap-2 flex-wrap">
                <span className={potentialDownside > 0 ? "text-green-500" : "text-red-500"}>距估值底部 {formatPercent(potentialDownside)}</span>
                <span className={potentialUpside > 0 ? "text-green-500" : "text-red-500"}>距估值頂部 {formatPercent(potentialUpside)}</span>
            </div>
        </article>
    );
};
