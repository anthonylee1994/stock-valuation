import type {StockWithQuote, ValuationStock} from "@/types";
import {describe, expect, it, vi} from "vitest";
import {calculatePotential, formatPercent, formatPrice, getActivePrice, getPriceColor, getStatus, getUniqueSymbols, sortStocks, validateAndDeduplicateStocks} from "../stockHelpers";

describe("validateAndDeduplicateStocks", () => {
    it("should return empty array for empty input", () => {
        const result = validateAndDeduplicateStocks([]);
        expect(result).toEqual([]);
    });

    it("should return same array when no duplicates", () => {
        const stocks: ValuationStock[] = [
            {symbol: "AAPL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 100, valuationHigh: 200},
            {symbol: "GOOGL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 150, valuationHigh: 250},
            {symbol: "MSFT", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 200, valuationHigh: 300},
        ];
        const result = validateAndDeduplicateStocks(stocks);
        expect(result).toHaveLength(3);
        expect(result).toEqual(stocks);
    });

    it("should remove duplicates and keep first occurrence", () => {
        const stocks: ValuationStock[] = [
            {symbol: "AAPL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 100, valuationHigh: 200},
            {symbol: "GOOGL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 150, valuationHigh: 250},
            {symbol: "AAPL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 110, valuationHigh: 210},
            {symbol: "MSFT", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 200, valuationHigh: 300},
            {symbol: "GOOGL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 160, valuationHigh: 260},
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
            {symbol: "AAPL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 100, valuationHigh: 200},
            {symbol: "AAPL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 110, valuationHigh: 210},
        ];
        validateAndDeduplicateStocks(stocks);
        expect(consoleWarnSpy).toHaveBeenCalled();
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Duplicate symbol detected"));
        consoleWarnSpy.mockRestore();
    });

    it("should handle multiple duplicate pairs", () => {
        const stocks: ValuationStock[] = [
            {symbol: "AAPL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 100, valuationHigh: 200},
            {symbol: "GOOGL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 150, valuationHigh: 250},
            {symbol: "AAPL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 110, valuationHigh: 210},
            {symbol: "MSFT", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 200, valuationHigh: 300},
            {symbol: "GOOGL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 160, valuationHigh: 260},
            {symbol: "MSFT", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 210, valuationHigh: 310},
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
        const stocks: ValuationStock[] = [{symbol: "AAPL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 100, valuationHigh: 200}];
        const result = getUniqueSymbols(stocks);
        expect(result).toBe("AAPL");
    });

    it("should return comma-separated symbols for multiple stocks", () => {
        const stocks: ValuationStock[] = [
            {symbol: "AAPL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 100, valuationHigh: 200},
            {symbol: "GOOGL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 150, valuationHigh: 250},
            {symbol: "MSFT", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 200, valuationHigh: 300},
        ];
        const result = getUniqueSymbols(stocks);
        expect(result).toBe("AAPL,GOOGL,MSFT");
    });

    it("should remove duplicate symbols", () => {
        const stocks: ValuationStock[] = [
            {symbol: "AAPL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 100, valuationHigh: 200},
            {symbol: "GOOGL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 150, valuationHigh: 250},
            {symbol: "AAPL", base: 0, lowMultiple: 0, highMultiple: 0, metric: "P/E", valuationLow: 110, valuationHigh: 210},
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
        const stocks: StockWithQuote[] = [
            {
                symbol: "AAPL",
                base: 0,
                lowMultiple: 0,
                highMultiple: 0,
                metric: "P/E",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 150,
                name: "Apple",
                market: "us_market",
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
                base: 0,
                lowMultiple: 0,
                highMultiple: 0,
                metric: "P/E",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 180,
                name: "Google",
                market: "us_market",
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
                base: 0,
                lowMultiple: 0,
                highMultiple: 0,
                metric: "P/E",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 120,
                name: "Microsoft",
                market: "us_market",
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
        const stocks: StockWithQuote[] = [
            {
                symbol: "AAPL",
                base: 0,
                lowMultiple: 0,
                highMultiple: 0,
                metric: "P/E",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 150,
                name: "Apple",
                market: "us_market",
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
                base: 0,
                lowMultiple: 0,
                highMultiple: 0,
                metric: "P/E",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 180,
                name: "Google",
                market: "us_market",
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
                base: 0,
                lowMultiple: 0,
                highMultiple: 0,
                metric: "P/E",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 120,
                name: "Microsoft",
                market: "us_market",
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
        const stocks: StockWithQuote[] = [
            {
                symbol: "AAPL",
                base: 0,
                lowMultiple: 0,
                highMultiple: 0,
                metric: "P/E",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 0,
                name: "Apple",
                market: "us_market",
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
                base: 0,
                lowMultiple: 0,
                highMultiple: 0,
                metric: "P/E",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 150,
                name: "Google",
                market: "us_market",
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
        const stocks: StockWithQuote[] = [
            {
                symbol: "AAPL",
                base: 0,
                lowMultiple: 0,
                highMultiple: 0,
                metric: "P/E",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 150,
                name: "Apple",
                market: "us_market",
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
                base: 0,
                lowMultiple: 0,
                highMultiple: 0,
                metric: "P/E",
                valuationLow: 100,
                valuationHigh: 200,
                currentPrice: 180,
                name: "Google",
                market: "us_market",
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

describe("getActivePrice", () => {
    const baseStock: StockWithQuote = {
        symbol: "AAPL",
        base: 0,
        lowMultiple: 0,
        highMultiple: 0,
        metric: "P/E",
        valuationLow: 100,
        valuationHigh: 200,
        currentPrice: 150,
        name: "Apple",
        market: "us_market",
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
    };

    it("should return current price if no pre/post market data", () => {
        const result = getActivePrice(baseStock);
        expect(result.price).toBe(150);
        expect(result.change).toBe(10);
        expect(result.percentChange).toBe(7.14);
    });

    it("should prefer post-market price over current", () => {
        const stock = {
            ...baseStock,
            postMarketPrice: 155,
            postMarketChange: 15,
            postMarketChangePercent: 10,
        };
        const result = getActivePrice(stock);
        expect(result.price).toBe(155);
        expect(result.change).toBe(15);
        expect(result.percentChange).toBe(10);
    });

    it("should prefer pre-market price over post-market and current", () => {
        const stock = {
            ...baseStock,
            postMarketPrice: 155,
            preMarketPrice: 160,
            preMarketChange: 20,
            preMarketChangePercent: 14,
        };
        const result = getActivePrice(stock);
        expect(result.price).toBe(160);
        expect(result.change).toBe(20);
        expect(result.percentChange).toBe(14);
    });
});

describe("getStatus", () => {
    it("should return undervalued when price < low", () => {
        expect(getStatus(90, 100, 200)).toBe("undervalued");
    });

    it("should return overvalued when price > high", () => {
        expect(getStatus(210, 100, 200)).toBe("overvalued");
    });

    it("should return fair when price is between low and high", () => {
        expect(getStatus(150, 100, 200)).toBe("fair");
    });

    it("should return fair when price equals low or high", () => {
        expect(getStatus(100, 100, 200)).toBe("fair");
        expect(getStatus(200, 100, 200)).toBe("fair");
    });
});

describe("formatPrice", () => {
    it("should format to 2 decimal places", () => {
        expect(formatPrice(123.456)).toBe("123.46");
        expect(formatPrice(123)).toBe("123.00");
    });
});

describe("formatPercent", () => {
    it("should format to 2 decimal places with %", () => {
        expect(formatPercent(12.345, false)).toBe("12.35%");
    });

    it("should add + sign for positive values if requested", () => {
        expect(formatPercent(12.345, true)).toBe("+12.35%");
    });

    it("should not add + sign for negative values even if requested", () => {
        expect(formatPercent(-12.345, true)).toBe("-12.35%");
    });

    it("should handle zero", () => {
        expect(formatPercent(0, true)).toBe("+0.00%");
        expect(formatPercent(0, false)).toBe("0.00%");
    });
});

describe("calculatePotential", () => {
    it("should calculate potential percentage", () => {
        expect(calculatePotential(100, 150)).toBe(50); // (150-100)/100 * 100 = 50%
        expect(calculatePotential(100, 80)).toBe(-20); // (80-100)/100 * 100 = -20%
    });

    it("should handle zero price", () => {
        expect(calculatePotential(0, 100)).toBe(0);
    });
});

describe("getPriceColor", () => {
    it("should return text-emerald-600 dark:text-emerald-400 for positive change", () => {
        expect(getPriceColor(1)).toBe("text-emerald-600 dark:text-emerald-400");
    });

    it("should return text-rose-600 dark:text-rose-400 for negative change", () => {
        expect(getPriceColor(-1)).toBe("text-rose-600 dark:text-rose-400");
    });

    it("should return text-muted for zero change", () => {
        expect(getPriceColor(0)).toBe("text-muted");
    });
});
