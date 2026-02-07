import {useEffect, useState} from "react";
import valuationData from "./valuation.json";
import {StockCard} from "./StockCard";
import type {StockWithQuote, Quote, ValuationData as ValuationDataT} from "./types";

function formatHKTime(date: Date): string {
    return date.toLocaleString("zh-HK", {
        timeZone: "Asia/Hong_Kong",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function mergeStocksWithQuotes(stocks: ValuationDataT["stocks"], quotes: Quote[]): StockWithQuote[] {
    const quoteMap = new Map(quotes.map(q => [q.symbol, q]));
    return stocks
        .map(stock => {
            const quote = quoteMap.get(stock.symbol);
            if (!quote) return null;
            return {
                ...stock,
                currentPrice: quote.currentPrice,
                change: quote.change,
                percentChange: quote.percentChange,
            };
        })
        .filter((s): s is StockWithQuote => s !== null);
}

export function App() {
    const [stocks, setStocks] = useState<StockWithQuote[]>([]);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [pulse, setPulse] = useState(false);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const data = valuationData as ValuationDataT;
    const symbols = data.stocks.map(s => s.symbol).join(",");

    const sortedStocks = [...stocks].sort((a, b) => {
        const aDistance = a.currentPrice > 0 ? -1 * ((a.currentPrice - a.valuationLow) / a.currentPrice) * 100 : 0;
        const bDistance = b.currentPrice > 0 ? -1 * ((b.currentPrice - b.valuationLow) / b.currentPrice) * 100 : 0;

        if (sortOrder === "asc") {
            return bDistance - aDistance;
        } else {
            return aDistance - bDistance;
        }
    });

    useEffect(() => {
        let cancelled = false;

        async function fetchQuotes() {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_QUOTES_API_URL}?symbols=${encodeURIComponent(symbols)}`);
                const json = (await res.json()) as {quotes: Quote[]};
                if (cancelled) return;
                const merged = mergeStocksWithQuotes(data.stocks, json.quotes);
                setStocks(merged);
                setLastUpdate(new Date());
                setPulse(true);
                const t = setTimeout(() => setPulse(false), 1500);
                return () => clearTimeout(t);
            } catch (e) {
                if (!cancelled) setStocks([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchQuotes();
        const interval = setInterval(fetchQuotes, 5 * 60 * 1000);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [symbols]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 max-[640px]:p-4">
            <header className="flex flex-wrap items-center justify-between gap-3 max-w-[1400px] mx-auto mb-6">
                <h1 className="m-0 text-[1.75rem] font-bold text-slate-50 tracking-wide max-[640px]:text-[1.35rem]">估值參考</h1>
                <div className="flex items-center gap-2">
                    {lastUpdate && <span className="text-[0.8rem] text-slate-400">更新時間（香港）: {formatHKTime(lastUpdate)}</span>}
                    {pulse && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden />}
                </div>
            </header>

            {loading && stocks.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-base">載入中…</div>
            ) : (
                <>
                    <div className="max-w-[1400px] mx-auto mb-6">
                        <div className="inline-flex rounded-md border border-slate-700 overflow-hidden">
                            <button
                                className={`px-4 py-2 text-sm font-medium transition-all ${
                                    sortOrder === "asc" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                }`}
                                onClick={() => setSortOrder("asc")}
                            >
                                由殘到貴 ↑
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium transition-all border-l border-slate-700 ${
                                    sortOrder === "desc" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                }`}
                                onClick={() => setSortOrder("desc")}
                            >
                                由貴到殘 ↓
                            </button>
                        </div>
                    </div>
                    <main className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 max-w-[1400px] mx-auto max-[640px]:grid-cols-1 max-[640px]:gap-4">
                        {sortedStocks.map(stock => (
                            <StockCard key={stock.symbol} stock={stock} />
                        ))}
                    </main>
                </>
            )}
        </div>
    );
}
