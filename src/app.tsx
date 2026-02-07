import {useEffect, useState} from "react";
import valuationData from "./valuation.json";
import {StockCard} from "./StockCard";
import type {StockWithQuote, Quote, ValuationData as ValuationDataT} from "./types";
import "./app.css";

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
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const data = valuationData as ValuationDataT;
    const symbols = data.stocks.map(s => s.symbol).join(",");

    const sortedStocks = [...stocks].sort((a, b) => {
        // Calculate distance from valuation bottom for each stock
        const aDistance = a.currentPrice > 0 ? -1 * ((a.currentPrice - a.valuationLow) / a.currentPrice) * 100 : 0;
        const bDistance = b.currentPrice > 0 ? -1 * ((b.currentPrice - b.valuationLow) / b.currentPrice) * 100 : 0;

        if (sortOrder === "asc") {
            // Ascending: most negative (furthest from bottom) to least negative (closest to bottom)
            return aDistance - bDistance;
        } else {
            // Descending: least negative (closest to bottom) to most negative (furthest from bottom)
            return bDistance - aDistance;
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
        <div className="app">
            <header className="app-header">
                <h1 className="app-title">估值參考</h1>
                <div className="app-meta">
                    {lastUpdate && <span className="update-time">更新時間（香港）: {formatHKTime(lastUpdate)}</span>}
                    {pulse && <span className="live-pulse" aria-hidden />}
                </div>
            </header>

            {loading && stocks.length === 0 ? (
                <div className="loading">載入中…</div>
            ) : (
                <>
                    <div className="controls">
                        <button className={`sort-button ${sortOrder === "desc" ? "active" : ""}`} onClick={() => setSortOrder("desc")}>
                            由殘到貴
                        </button>
                        <button className={`sort-button ${sortOrder === "asc" ? "active" : ""}`} onClick={() => setSortOrder("asc")}>
                            由貴到殘
                        </button>
                    </div>
                    <main className="card-grid">
                        {sortedStocks.map(stock => (
                            <StockCard key={stock.symbol} stock={stock} />
                        ))}
                    </main>
                </>
            )}
        </div>
    );
}
