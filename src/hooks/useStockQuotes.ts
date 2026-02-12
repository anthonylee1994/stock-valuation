import {useEffect, useState} from "react";
import type {StockWithQuote, Quote, ValuationData} from "../types";
import moment from "moment";

const mergeStocksWithQuotes = (stocks: ValuationData["stocks"], quotes: Quote[]): StockWithQuote[] => {
    const quoteMap = new Map(quotes.map(q => [q.symbol, q]));
    return stocks
        .map(stock => {
            const quote = quoteMap.get(stock.symbol);
            if (!quote) return null;
            return {
                ...stock,
                ...quote,
            };
        })
        .filter((s): s is StockWithQuote => s !== null);
};

export const useStockQuotes = (symbols: string, stocks: ValuationData["stocks"]) => {
    const [data, setData] = useState<StockWithQuote[]>([]);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchQuotes = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_QUOTES_API_URL}?symbols=${encodeURIComponent(symbols)}`);
                const json = (await res.json()) as {quotes: Quote[]};
                if (cancelled) return;
                const merged = mergeStocksWithQuotes(stocks, json.quotes);
                setData(merged);
                setLastUpdate(moment().format("YYYY-MM-DD HH:mm:ss"));
                setPulse(true);
                const t = setTimeout(() => setPulse(false), 1500);
                return () => clearTimeout(t);
            } catch (e) {
                if (!cancelled) setData([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchQuotes();
        const interval = setInterval(fetchQuotes, 10_000);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [symbols, stocks]);

    return {data, lastUpdate, loading, pulse};
};
