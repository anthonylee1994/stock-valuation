import type {StockWithQuote, ValuationStock} from "@/types";
import {describe, expect, it, vi} from "vitest";
import {formatPercent, formatPrice, getActivePrice, getPriceColor, getStatus, getUniqueSymbols, sortStocks, validateAndDeduplicateStocks} from "../stockHelpers";

function createValuationStock(overrides: Partial<ValuationStock> = {}): ValuationStock {
    return {
        symbol: "AAPL",
        base: 0,
        lowMultiple: 0,
        highMultiple: 0,
        metric: "P/E",
        valuationLow: 100,
        valuationHigh: 200,
        potentialDownside: -33.33,
        potentialUpside: 33.33,
        ...overrides,
    };
}

function createStockWithQuote(overrides: Partial<StockWithQuote> = {}): StockWithQuote {
    return {
        ...createValuationStock(),
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
        ...overrides,
    };
}

describe("validateAndDeduplicateStocks", () => {
    it("should return empty array for empty input", () => {
        expect(validateAndDeduplicateStocks([])).toEqual([]);
    });

    it("should return same array when no duplicates", () => {
        const stocks: ValuationStock[] = [
            createValuationStock(),
            createValuationStock({symbol: "GOOGL", valuationLow: 150, valuationHigh: 250}),
            createValuationStock({symbol: "MSFT", valuationLow: 200, valuationHigh: 300}),
        ];

        const result = validateAndDeduplicateStocks(stocks);

        expect(result).toHaveLength(3);
        expect(result).toEqual(stocks);
    });

    it("should remove duplicates and keep first occurrence", () => {
        const stocks: ValuationStock[] = [
            createValuationStock(),
            createValuationStock({symbol: "GOOGL", valuationLow: 150, valuationHigh: 250}),
            createValuationStock({symbol: "AAPL", valuationLow: 110, valuationHigh: 210}),
            createValuationStock({symbol: "MSFT", valuationLow: 200, valuationHigh: 300}),
            createValuationStock({symbol: "GOOGL", valuationLow: 160, valuationHigh: 260}),
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
        const stocks: ValuationStock[] = [createValuationStock(), createValuationStock({symbol: "AAPL", valuationLow: 110, valuationHigh: 210})];

        validateAndDeduplicateStocks(stocks);

        expect(consoleWarnSpy).toHaveBeenCalled();
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Duplicate symbol detected"));
        consoleWarnSpy.mockRestore();
    });

    it("should handle multiple duplicate pairs", () => {
        const stocks: ValuationStock[] = [
            createValuationStock(),
            createValuationStock({symbol: "GOOGL", valuationLow: 150, valuationHigh: 250}),
            createValuationStock({symbol: "AAPL", valuationLow: 110, valuationHigh: 210}),
            createValuationStock({symbol: "MSFT", valuationLow: 200, valuationHigh: 300}),
            createValuationStock({symbol: "GOOGL", valuationLow: 160, valuationHigh: 260}),
            createValuationStock({symbol: "MSFT", valuationLow: 210, valuationHigh: 310}),
        ];

        expect(validateAndDeduplicateStocks(stocks)).toHaveLength(3);
    });
});

describe("getUniqueSymbols", () => {
    it("should return empty string for empty array", () => {
        expect(getUniqueSymbols([])).toBe("");
    });

    it("should return single symbol for single stock", () => {
        expect(getUniqueSymbols([createValuationStock()])).toBe("AAPL");
    });

    it("should return comma-separated symbols for multiple stocks", () => {
        const stocks: ValuationStock[] = [
            createValuationStock(),
            createValuationStock({symbol: "GOOGL", valuationLow: 150, valuationHigh: 250}),
            createValuationStock({symbol: "MSFT", valuationLow: 200, valuationHigh: 300}),
        ];

        expect(getUniqueSymbols(stocks)).toBe("AAPL,GOOGL,MSFT");
    });

    it("should remove duplicate symbols", () => {
        const stocks: ValuationStock[] = [
            createValuationStock(),
            createValuationStock({symbol: "GOOGL", valuationLow: 150, valuationHigh: 250}),
            createValuationStock({symbol: "AAPL", valuationLow: 110, valuationHigh: 210}),
        ];

        expect(getUniqueSymbols(stocks)).toBe("AAPL,GOOGL");
    });
});

describe("sortStocks", () => {
    it("should return empty array for empty input", () => {
        expect(sortStocks([], "asc")).toEqual([]);
    });

    it("should sort ascending by valuation bar marker position", () => {
        const stocks: StockWithQuote[] = [
            createStockWithQuote({symbol: "AAPL", currentPrice: 80, valuationLow: 100, valuationHigh: 200}),
            createStockWithQuote({symbol: "GOOGL", name: "Google", currentPrice: 150, valuationLow: 100, valuationHigh: 200, change: 20, percentChange: 12.5, previousClosePrice: 130}),
            createStockWithQuote({symbol: "MSFT", name: "Microsoft", currentPrice: 240, valuationLow: 100, valuationHigh: 200, change: 5, percentChange: 2.13, previousClosePrice: 235}),
        ];

        const result = sortStocks(stocks, "asc");

        expect(result[0].symbol).toBe("AAPL");
        expect(result[1].symbol).toBe("GOOGL");
        expect(result[2].symbol).toBe("MSFT");
    });

    it("should sort descending by valuation bar marker position", () => {
        const stocks: StockWithQuote[] = [
            createStockWithQuote({symbol: "AAPL", currentPrice: 80, valuationLow: 100, valuationHigh: 200}),
            createStockWithQuote({symbol: "GOOGL", name: "Google", currentPrice: 150, valuationLow: 100, valuationHigh: 200, change: 20, percentChange: 12.5, previousClosePrice: 130}),
            createStockWithQuote({symbol: "MSFT", name: "Microsoft", currentPrice: 240, valuationLow: 100, valuationHigh: 200, change: 5, percentChange: 2.13, previousClosePrice: 235}),
        ];

        const result = sortStocks(stocks, "desc");

        expect(result[0].symbol).toBe("MSFT");
        expect(result[1].symbol).toBe("GOOGL");
        expect(result[2].symbol).toBe("AAPL");
    });

    it("should sort using the displayed active price when calculating marker position", () => {
        const stocks: StockWithQuote[] = [
            createStockWithQuote({
                symbol: "AAPL",
                currentPrice: 150,
                valuationLow: 100,
                valuationHigh: 200,
                postMarketPrice: 90,
                postMarketChange: -60,
                postMarketChangePercent: -40,
            }),
            createStockWithQuote({
                symbol: "MSFT",
                name: "Microsoft",
                currentPrice: 120,
                valuationLow: 100,
                valuationHigh: 200,
                change: 5,
                percentChange: 4.35,
                previousClosePrice: 115,
            }),
        ];

        const result = sortStocks(stocks, "asc");

        expect(result[0].symbol).toBe("AAPL");
        expect(result[1].symbol).toBe("MSFT");
    });

    it("should handle zero current price", () => {
        const stocks: StockWithQuote[] = [createStockWithQuote({currentPrice: 0, change: 0, percentChange: 0, previousClosePrice: 100}), createStockWithQuote({symbol: "GOOGL", name: "Google"})];

        const result = sortStocks(stocks, "asc");

        expect(result[0].symbol).toBe("AAPL");
        expect(result[1].symbol).toBe("GOOGL");
    });

    it("should not mutate original array", () => {
        const stocks: StockWithQuote[] = [
            createStockWithQuote({symbol: "AAPL"}),
            createStockWithQuote({symbol: "GOOGL", name: "Google", currentPrice: 180, change: 20, percentChange: 12.5, previousClosePrice: 160}),
        ];

        const originalOrder = stocks.map(s => s.symbol);

        sortStocks(stocks, "asc");

        expect(stocks.map(s => s.symbol)).toEqual(originalOrder);
    });
});

describe("getActivePrice", () => {
    const baseStock: StockWithQuote = createStockWithQuote();

    it("should return current price if no pre/post market data", () => {
        const result = getActivePrice(baseStock);

        expect(result.price).toBe(150);
        expect(result.change).toBe(10);
        expect(result.percentChange).toBe(7.14);
    });

    it("should prefer post-market price over current", () => {
        const result = getActivePrice({
            ...baseStock,
            postMarketPrice: 155,
            postMarketChange: 15,
            postMarketChangePercent: 10,
        });

        expect(result.price).toBe(155);
        expect(result.change).toBe(15);
        expect(result.percentChange).toBe(10);
    });

    it("should prefer pre-market price over post-market and current", () => {
        const result = getActivePrice({
            ...baseStock,
            postMarketPrice: 155,
            preMarketPrice: 160,
            preMarketChange: 20,
            preMarketChangePercent: 14,
        });

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
