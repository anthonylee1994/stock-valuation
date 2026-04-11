import type {StockWithQuote} from "@/types";

interface StockCardProps {
    stock: StockWithQuote;
}

const MEMO_COMPARE_FIELDS: (keyof StockWithQuote)[] = [
    "symbol",
    "name",
    "currentPrice",
    "change",
    "percentChange",
    "preMarketPrice",
    "preMarketChange",
    "preMarketChangePercent",
    "postMarketPrice",
    "postMarketChange",
    "postMarketChangePercent",
    "valuationLow",
    "valuationHigh",
    "potentialDownside",
    "potentialUpside",
    "metric",
    "base",
    "lowMultiple",
    "highMultiple",
    "forwardPE",
    "priceToBook",
    "dividendYield",
];

export function areStockCardPropsEqual(prev: StockCardProps, next: StockCardProps) {
    return MEMO_COMPARE_FIELDS.every(field => prev.stock[field] === next.stock[field]);
}
