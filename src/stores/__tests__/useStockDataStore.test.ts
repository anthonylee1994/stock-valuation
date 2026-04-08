import type {ValuationStock} from "@/types";
import {useStockDataStore} from "@/stores/useStockDataStore";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

const valuationStocks: ValuationStock[] = [
    {
        symbol: "AAPL",
        name: "Apple",
        base: 1,
        lowMultiple: 10,
        highMultiple: 20,
        metric: "P/E",
        valuationLow: 100,
        valuationHigh: 200,
    },
];

describe("useStockDataStore retryFetch", () => {
    beforeEach(() => {
        useStockDataStore.setState({
            stocks: [],
            loading: true,
            initialLoading: true,
            lastUpdate: null,
            error: null,
            warnings: [],
            valuationStocks: [],
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("refetches valuation data before fetching quotes when no tracked stocks are loaded", async () => {
        const fetchQuotes = vi.fn().mockResolvedValue(undefined);
        const fetchValuationData = vi.fn().mockImplementation(async () => {
            useStockDataStore.setState({valuationStocks});
        });

        useStockDataStore.setState({
            valuationStocks: [],
            fetchValuationData,
            fetchQuotes,
        });

        useStockDataStore.getState().retryFetch();
        await Promise.resolve();
        await Promise.resolve();

        expect(fetchValuationData).toHaveBeenCalledTimes(1);
        expect(fetchQuotes).toHaveBeenCalledTimes(1);
    });

    it("fetches quotes directly when valuation data is already available", () => {
        const fetchQuotes = vi.fn().mockResolvedValue(undefined);
        const fetchValuationData = vi.fn().mockResolvedValue(undefined);

        useStockDataStore.setState({
            valuationStocks,
            fetchValuationData,
            fetchQuotes,
        });

        useStockDataStore.getState().retryFetch();

        expect(fetchQuotes).toHaveBeenCalledTimes(1);
        expect(fetchValuationData).not.toHaveBeenCalled();
    });
});
