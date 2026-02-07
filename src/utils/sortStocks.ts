import type {StockWithQuote} from "../types";

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
