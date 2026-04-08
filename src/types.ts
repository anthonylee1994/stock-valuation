export type ValuationMetricType = "P/E" | "P/S" | "P/B" | "P/OCF" | "股息率";
export type MarketFilter = "us_market" | "hk_market";

export interface ValuationStock {
    symbol: string;
    name?: string;
    base: number;
    lowMultiple: number;
    highMultiple: number;
    metric: ValuationMetricType;
    valuationLow: number;
    valuationHigh: number;
}

export interface ValuationData {
    stocks: ValuationStock[];
    warnings: string[];
}

export interface Quote {
    symbol: string;
    name: string | null;
    market: MarketFilter;
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

export interface ApiQuotesResponse {
    quotes: Quote[];
}

export type StockWithQuote = ValuationStock & Quote;

export type ValuationStatus = "undervalued" | "fair" | "overvalued";
