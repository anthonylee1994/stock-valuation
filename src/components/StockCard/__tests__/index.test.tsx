import type {StockWithQuote} from "@/types";
import {describe, expect, it} from "vitest";
import {areStockCardPropsEqual} from "../comparator";

function createStock(overrides: Partial<StockWithQuote> = {}): StockWithQuote {
    return {
        symbol: "AAPL",
        name: "Apple",
        base: 10,
        lowMultiple: 12,
        highMultiple: 18,
        metric: "P/E",
        valuationLow: 120,
        valuationHigh: 180,
        potentialDownside: -20,
        potentialUpside: 20,
        market: "us_market",
        currentPrice: 150,
        change: 5,
        percentChange: 3.45,
        previousClosePrice: 145,
        regularMarketTime: "2024-01-01T00:00:00Z",
        preMarketPrice: null,
        preMarketChange: null,
        preMarketTime: null,
        preMarketChangePercent: null,
        postMarketPrice: null,
        postMarketChange: null,
        postMarketChangePercent: null,
        postMarketTime: null,
        forwardPE: 15,
        priceToBook: 2.5,
        dividendYield: 1.2,
        ...overrides,
    };
}

describe("areStockCardPropsEqual", () => {
    it("returns false when valuation metadata changes", () => {
        const prev = {stock: createStock()};
        const next = {stock: createStock({metric: "P/B", base: 20, lowMultiple: 1.2, highMultiple: 1.8})};

        expect(areStockCardPropsEqual(prev, next)).toBe(false);
    });

    it("returns false when active-market percentage changes", () => {
        const prev = {stock: createStock({preMarketPrice: 155, preMarketChange: 10, preMarketChangePercent: 6.9})};
        const next = {stock: createStock({preMarketPrice: 155, preMarketChange: 10, preMarketChangePercent: 7.1})};

        expect(areStockCardPropsEqual(prev, next)).toBe(false);
    });

    it("returns true when all rendered fields are unchanged", () => {
        const prev = {stock: createStock()};
        const next = {stock: createStock()};

        expect(areStockCardPropsEqual(prev, next)).toBe(true);
    });
});
