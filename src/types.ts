export interface ValuationStock {
    symbol: string;
    valuationLow: number;
    valuationHigh: number;
}

export interface ValuationData {
    stocks: ValuationStock[];
}

export interface Quote {
    symbol: string;
    name: string;
    market: string;
    currentPrice: number;
    change: number;
    percentChange: number;
    previousClosePrice: number;
    regularMarketTime: string;
    preMarketPrice: number | null;
    preMarketChange: number | null;
    preMarketTime: string | null;
    preMarketChangePercent: number | null;
    postMarketPrice: number | null;
    postMarketChange: number | null;
    postMarketChangePercent: number | null;
    postMarketTime: string | null;
    forwardPE: number | null;
    priceToBook: number | null;
    dividendYield: number | null;
}

export type StockWithQuote = ValuationStock & Quote;

export type ValuationStatus = "undervalued" | "fair" | "overvalued";
