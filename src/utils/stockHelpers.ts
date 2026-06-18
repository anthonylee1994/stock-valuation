import type {StockWithQuote, ValuationData, ValuationStatus} from "@/types";

/**
 * Validate and deduplicate stocks array
 * Keeps first occurrence of duplicate symbols and logs warnings
 */
export function validateAndDeduplicateStocks(stocks: ValuationData["stocks"]) {
    const seen = new Map<string, number>();
    const duplicates: string[] = [];

    stocks.forEach((stock, index) => {
        const existing = seen.get(stock.symbol);
        if (existing !== undefined) {
            duplicates.push(stock.symbol);
            console.warn(`Duplicate symbol detected: "${stock.symbol}" at index ${existing} and ${index}. Keeping first occurrence.`);
        } else {
            seen.set(stock.symbol, index);
        }
    });

    const deduped = stocks.filter((stock, index) => seen.get(stock.symbol) === index);

    if (duplicates.length > 0) {
        console.warn(`Found ${duplicates.length} duplicate symbol(s): ${[...new Set(duplicates)].join(", ")}`);
    }

    return deduped;
}

/**
 * Extract unique symbols from stocks array and return as comma-separated string
 */
export function getUniqueSymbols(stocks: ValuationData["stocks"]): string {
    const uniqueSymbols = new Set(stocks.map(s => s.symbol));
    return Array.from(uniqueSymbols).join(",");
}

function getValuationPosition(price: number, valuationLow: number, valuationHigh: number): number {
    const valuationRange = valuationHigh - valuationLow;

    if (valuationRange <= 0) {
        return price >= valuationHigh ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }

    return (price - valuationLow) / valuationRange;
}

/**
 * Sort stocks by price position relative to each stock's valuation range
 */
export function sortStocks(stocks: StockWithQuote[], sortOrder: "asc" | "desc"): StockWithQuote[] {
    return [...stocks].sort((a, b) => {
        const aPosition = getValuationPosition(getActivePrice(a).price, a.valuationLow, a.valuationHigh);
        const bPosition = getValuationPosition(getActivePrice(b).price, b.valuationLow, b.valuationHigh);

        if (sortOrder === "asc") {
            return aPosition - bPosition;
        }

        return bPosition - aPosition;
    });
}

/**
 * Get the active price data (pre-market, post-market, or current) for a stock
 */
export function getActivePrice(stock: StockWithQuote) {
    return {
        price: stock.preMarketPrice ?? stock.postMarketPrice ?? stock.currentPrice,
        change: stock.preMarketChange ?? stock.postMarketChange ?? stock.change,
        percentChange: stock.preMarketChangePercent ?? stock.postMarketChangePercent ?? stock.percentChange,
    };
}

export function getStatus(currentPrice: number, low: number, high: number): ValuationStatus {
    if (currentPrice < low) return "undervalued";
    if (currentPrice > high) return "overvalued";
    return "fair";
}

export function formatPrice(value: number): string {
    return value.toFixed(2);
}

export function formatPercent(value: number, showSign: boolean): string {
    const sign = showSign && value >= 0 ? "+" : "";
    return sign + value.toFixed(2) + "%";
}

export function getPriceColor(change: number) {
    if (change > 0) return "text-emerald-400";
    if (change < 0) return "text-rose-400";
    return "text-muted";
}
