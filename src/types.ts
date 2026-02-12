export interface ValuationStock {
    symbol: string;
    market: "US" | "HK";
    valuationLow: number;
    valuationHigh: number;
}

export interface ValuationData {
    stocks: ValuationStock[];
}

export interface Quote {
    symbol: string;
    currentPrice: number;
    change: number;
    percentChange: number;
    previousClosePrice: number;
    regularMarketTime: string;
    preMarketPrice?: number;
    preMarketChange?: number;
    preMarketTime?: string;
    preMarketChangePercent?: number;
    postMarketPrice?: number;
    postMarketChange?: number;
    postMarketChangePercent?: number;
    postMarketTime?: string;
    forwardPE?: number;
    priceToBook?: number;
    dividendYield?: number;
}

export type StockWithQuote = ValuationStock & Quote;

export type ValuationStatus = "undervalued" | "fair" | "overvalued";
