import type {StockWithQuote, ValuationData} from "@/types";

/**
 * Validate and deduplicate stocks array
 * Keeps first occurrence of duplicate symbols and logs warnings
 */
export const validateAndDeduplicateStocks = (stocks: ValuationData["stocks"]) => {
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
};

/**
 * Extract unique symbols from stocks array and return as comma-separated string
 */
export const getUniqueSymbols = (stocks: ValuationData["stocks"]): string => {
    const uniqueSymbols = new Set(stocks.map(s => s.symbol));
    return Array.from(uniqueSymbols).join(",");
};

/**
 * Sort stocks by distance from valuation low to high or high to low
 */
export const sortStocks = (stocks: StockWithQuote[], sortOrder: "asc" | "desc"): StockWithQuote[] => {
    return [...stocks].sort((a, b) => {
        const aDistance = a.currentPrice > 0 ? ((a.currentPrice - a.valuationLow) / a.currentPrice) * 100 : 0;
        const bDistance = b.currentPrice > 0 ? ((b.currentPrice - b.valuationLow) / b.currentPrice) * 100 : 0;

        if (sortOrder === "asc") {
            return aDistance - bDistance;
        } else {
            return bDistance - aDistance;
        }
    });
};
