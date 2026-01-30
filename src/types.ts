export interface ValuationStock {
    symbol: string;
    valuationLow: number;
    valuationHigh: number;
}

export interface ValuationData {
    lastUpdated: string;
    currency: string;
    stocks: ValuationStock[];
}

export interface Quote {
    symbol: string;
    currentPrice: number;
    change: number;
    percentChange: number;
    previousClosePrice: number;
}

export interface StockWithQuote extends ValuationStock {
    currentPrice: number;
    change: number;
    percentChange: number;
}

export type ValuationStatus = "undervalued" | "fair" | "overvalued";
