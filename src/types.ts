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
    preMarketPrice?: number;
    preMarketChange?: number;
    preMarketTime?: string;
    preMarketChangePercent?: number;
    postMarketPrice?: number;
    postMarketChange?: number;
    postMarketChangePercent?: number;
    postMarketTime?: string;
}

export type StockWithQuote = ValuationStock & Quote;

export type ValuationStatus = "undervalued" | "fair" | "overvalued";
