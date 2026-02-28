import {describe, it, expect, vi} from "vitest";
import {validateAndDeduplicateStocks, getUniqueSymbols, sortStocks} from "../stockHelpers";
import type {ValuationStock} from "@/types";

describe("validateAndDeduplicateStocks", () => {
    it("should return empty array for empty input", () => {
        const result = validateAndDeduplicateStocks([]);
        expect(result).toEqual([]);
    });

    it("should return same array when no duplicates", () => {
        const stocks: ValuationStock[] = [
            {symbol: "AAPL", valuationLow: 100, valuationHigh: 200},
            {symbol: "GOOGL", valuationLow: 150, valuationHigh: 250},
            {symbol: "MSFT", valuationLow: 200, valuationHigh: 300},
        ];
        const result = validateAndDeduplicateStocks(stocks);
        expect(result).toHaveLength(3);
        expect(result).toEqual(stocks);
    });

    it("should remove duplicates and keep first occurrence", () => {
        const stocks: ValuationStock[] = [
            {symbol: "AAPL", valuationLow: 100, valuationHigh: 200},
            {symbol: "GOOGL", valuationLow: 150, valuationHigh: 250},
            {symbol: "AAPL", valuationLow: 110, valuationHigh: 210},
            {symbol: "MSFT", valuationLow: 200, valuationHigh: 300},
            {symbol: "GOOGL", valuationLow: 160, valuationHigh: 260},
        ];
        const result = validateAndDeduplicateStocks(stocks);
        expect(result).toHaveLength(3);
        expect(result[0].symbol).toBe("AAPL");
        expect(result[0].valuationLow).toBe(100);
        expect(result[1].symbol).toBe("GOOGL");
        expect(result[1].valuationLow).toBe(150);
    });

    it("should log warning for duplicates", () => {
        const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const stocks: ValuationStock[] = [
            {symbol: "AAPL", valuationLow: 100, valuationHigh: 200},
            {symbol: "AAPL", valuationLow: 110, valuationHigh: 210},
        ];
        validateAndDeduplicateStocks(stocks);
        expect(consoleWarnSpy).toHaveBeenCalled();
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Duplicate symbol detected"));
        consoleWarnSpy.mockRestore();
    });

    it("should handle multiple duplicate pairs", () => {
        const stocks: ValuationStock[] = [
            {symbol: "AAPL", valuationLow: 100, valuationHigh: 200},
            {symbol: "GOOGL", valuationLow: 150, valuationHigh: 250},
            {symbol: "AAPL", valuationLow: 110, valuationHigh: 210},
            {symbol: "MSFT", valuationLow: 200, valuationHigh: 300},
            {symbol: "GOOGL", valuationLow: 160, valuationHigh: 260},
            {symbol: "MSFT", valuationLow: 210, valuationHigh: 310},
        ];
        const result = validateAndDeduplicateStocks(stocks);
        expect(result).toHaveLength(3);
    });
});

describe("getUniqueSymbols", () => {
    it("should return empty string for empty array", () => {
        const result = getUniqueSymbols([]);
        expect(result).toBe("");
    });

    it("should return single symbol for single stock", () => {
        const stocks: ValuationStock[] = [
            {symbol: "AAPL", valuationLow: 100, valuationHigh: 200},
        ];
        const result = getUniqueSymbols(stocks);
        expect(result).toBe("AAPL");
    });

    it("should return comma-separated symbols for multiple stocks", () => {
        const stocks: ValuationStock[] = [
            {symbol: "AAPL", valuationLow: 100, valuationHigh: 200},
            {symbol: "GOOGL", valuationLow: 150, valuationHigh: 250},
            {symbol: "MSFT", valuationLow: 200, valuationHigh: 300},
        ];
        const result = getUniqueSymbols(stocks);
        expect(result).toBe("AAPL,GOOGL,MSFT");
    });

    it("should remove duplicate symbols", () => {
        const stocks: ValuationStock[] = [
            {symbol: "AAPL", valuationLow: 100, valuationHigh: 200},
            {symbol: "GOOGL", valuationLow: 150, valuationHigh: 250},
            {symbol: "AAPL", valuationLow: 110, valuationHigh: 210},
        ];
        const result = getUniqueSymbols(stocks);
        expect(result).toBe("AAPL,GOOGL");
    });
});

describe("sortStocks", () => {
    it("should return empty array for empty input", () => {
        const result = sortStocks([], "asc");
        expect(result).toEqual([]);
    });

    it("should sort ascending by distance from valuation low", () => {
        const stocks = [
            {
                symbol: "AAPL",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 150,
                name: "Apple",
                market: "US",
                change: 10,
                percentChange: 7.14,
                previousClosePrice: 140,
                regularMarketTime: "2024-01-01",
                preMarketPrice: null,
                preMarketChange: null,
                preMarketTime: null,
                preMarketChangePercent: null,
                postMarketPrice: null,
                postMarketChange: null,
                postMarketChangePercent: null,
                postMarketTime: null,
                forwardPE: null,
                priceToBook: null,
                dividendYield: null,
            },
            {
                symbol: "GOOGL",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 180,
                name: "Google",
                market: "US",
                change: 20,
                percentChange: 12.5,
                previousClosePrice: 160,
                regularMarketTime: "2024-01-01",
                preMarketPrice: null,
                preMarketChange: null,
                preMarketTime: null,
                preMarketChangePercent: null,
                postMarketPrice: null,
                postMarketChange: null,
                postMarketChangePercent: null,
                postMarketTime: null,
                forwardPE: null,
                priceToBook: null,
                dividendYield: null,
            },
            {
                symbol: "MSFT",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 120,
                name: "Microsoft",
                market: "US",
                change: 5,
                percentChange: 4.35,
                previousClosePrice: 115,
                regularMarketTime: "2024-01-01",
                preMarketPrice: null,
                preMarketChange: null,
                preMarketTime: null,
                preMarketChangePercent: null,
                postMarketPrice: null,
                postMarketChange: null,
                postMarketChangePercent: null,
                postMarketTime: null,
                forwardPE: null,
                priceToBook: null,
                dividendYield: null,
            },
        ];
        const result = sortStocks(stocks, "asc");
        expect(result[0].symbol).toBe("MSFT");
        expect(result[1].symbol).toBe("AAPL");
        expect(result[2].symbol).toBe("GOOGL");
    });

    it("should sort descending by distance from valuation low", () => {
        const stocks = [
            {
                symbol: "AAPL",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 150,
                name: "Apple",
                market: "US",
                change: 10,
                percentChange: 7.14,
                previousClosePrice: 140,
                regularMarketTime: "2024-01-01",
                preMarketPrice: null,
                preMarketChange: null,
                preMarketTime: null,
                preMarketChangePercent: null,
                postMarketPrice: null,
                postMarketChange: null,
                postMarketChangePercent: null,
                postMarketTime: null,
                forwardPE: null,
                priceToBook: null,
                dividendYield: null,
            },
            {
                symbol: "GOOGL",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 180,
                name: "Google",
                market: "US",
                change: 20,
                percentChange: 12.5,
                previousClosePrice: 160,
                regularMarketTime: "2024-01-01",
                preMarketPrice: null,
                preMarketChange: null,
                preMarketTime: null,
                preMarketChangePercent: null,
                postMarketPrice: null,
                postMarketChange: null,
                postMarketChangePercent: null,
                postMarketTime: null,
                forwardPE: null,
                priceToBook: null,
                dividendYield: null,
            },
            {
                symbol: "MSFT",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 120,
                name: "Microsoft",
                market: "US",
                change: 5,
                percentChange: 4.35,
                previousClosePrice: 115,
                regularMarketTime: "2024-01-01",
                preMarketPrice: null,
                preMarketChange: null,
                preMarketTime: null,
                preMarketChangePercent: null,
                postMarketPrice: null,
                postMarketChange: null,
                postMarketChangePercent: null,
                postMarketTime: null,
                forwardPE: null,
                priceToBook: null,
                dividendYield: null,
            },
        ];
        const result = sortStocks(stocks, "desc");
        expect(result[0].symbol).toBe("GOOGL");
        expect(result[1].symbol).toBe("AAPL");
        expect(result[2].symbol).toBe("MSFT");
    });

    it("should handle zero current price", () => {
        const stocks = [
            {
                symbol: "AAPL",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 0,
                name: "Apple",
                market: "US",
                change: 0,
                percentChange: 0,
                previousClosePrice: 100,
                regularMarketTime: "2024-01-01",
                preMarketPrice: null,
                preMarketChange: null,
                preMarketTime: null,
                preMarketChangePercent: null,
                postMarketPrice: null,
                postMarketChange: null,
                postMarketChangePercent: null,
                postMarketTime: null,
                forwardPE: null,
                priceToBook: null,
                dividendYield: null,
            },
            {
                symbol: "GOOGL",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 150,
                name: "Google",
                market: "US",
                change: 10,
                percentChange: 7.14,
                previousClosePrice: 140,
                regularMarketTime: "2024-01-01",
                preMarketPrice: null,
                preMarketChange: null,
                preMarketTime: null,
                preMarketChangePercent: null,
                postMarketPrice: null,
                postMarketChange: null,
                postMarketChangePercent: null,
                postMarketTime: null,
                forwardPE: null,
                priceToBook: null,
                dividendYield: null,
            },
        ];
        const result = sortStocks(stocks, "asc");
        expect(result[0].symbol).toBe("AAPL");
        expect(result[1].symbol).toBe("GOOGL");
    });

    it("should not mutate original array", () => {
        const stocks = [
            {
                symbol: "AAPL",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 150,
                name: "Apple",
                market: "US",
                change: 10,
                percentChange: 7.14,
                previousClosePrice: 140,
                regularMarketTime: "2024-01-01",
                preMarketPrice: null,
                preMarketChange: null,
                preMarketTime: null,
                preMarketChangePercent: null,
                postMarketPrice: null,
                postMarketChange: null,
                postMarketChangePercent: null,
                postMarketTime: null,
                forwardPE: null,
                priceToBook: null,
                dividendYield: null,
            },
            {
                symbol: "GOOGL",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 180,
                name: "Google",
                market: "US",
                change: 20,
                percentChange: 12.5,
                previousClosePrice: 160,
                regularMarketTime: "2024-01-01",
                preMarketPrice: null,
                preMarketChange: null,
                preMarketTime: null,
                preMarketChangePercent: null,
                postMarketPrice: null,
                postMarketChange: null,
                postMarketChangePercent: null,
                postMarketTime: null,
                forwardPE: null,
                priceToBook: null,
                dividendYield: null,
            },
        ];
        const originalOrder = stocks.map(s => s.symbol);
        sortStocks(stocks, "asc");
        expect(stocks.map(s => s.symbol)).toEqual(originalOrder);
    });
});
