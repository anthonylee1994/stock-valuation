import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {useStockDataStore} from "@/stores/useStockDataStore";
import {api} from "@/utils/api";
import {decode} from "@toon-format/toon";
import type {ValuationStock} from "@/types";

vi.mock("@/utils/api", () => ({
    api: {
        get: vi.fn(),
    },
}));

vi.mock("@toon-format/toon", () => ({
    decode: vi.fn(value => value),
}));

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
        potentialDownside: -16.67,
        potentialUpside: 66.67,
    },
];

describe("useStockDataStore fetchQuotes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useStockDataStore.setState({
            stocks: [],
            loading: false,
            initialLoading: false,
            lastUpdate: null,
            error: null,
            warnings: [],
            valuationStocks,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("keeps the latest successful response when an older request resolves later", async () => {
        let resolveFirst: ((value: unknown) => void) | undefined;

        vi.mocked(api.get)
            .mockImplementationOnce(
                () =>
                    new Promise(resolve => {
                        resolveFirst = resolve;
                    })
            )
            .mockResolvedValueOnce({
                data: {
                    quotes: [
                        {
                            symbol: "AAPL",
                            name: "Apple",
                            market: "NASDAQ",
                            currentPrice: 120,
                            change: 5,
                            percentChange: 1,
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
                    ],
                },
            } as never);

        const firstPromise = useStockDataStore.getState().fetchQuotes();
        const secondPromise = useStockDataStore.getState().fetchQuotes();

        await secondPromise;

        resolveFirst?.({
            data: {
                quotes: [
                    {
                        symbol: "AAPL",
                        name: "Apple",
                        market: "NASDAQ",
                        currentPrice: 90,
                        change: -1,
                        percentChange: -1,
                        previousClosePrice: 91,
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
                ],
            },
        });

        await firstPromise;

        expect(useStockDataStore.getState().stocks[0]?.currentPrice).toBe(120);
    });

    it("records a warning when some symbols are missing from the quotes response", async () => {
        vi.mocked(api.get).mockResolvedValue({
            data: {
                quotes: [],
            },
        } as never);

        vi.mocked(decode).mockReturnValue({
            quotes: [
                {
                    symbol: "MSFT",
                    name: "Microsoft",
                    market: "NASDAQ",
                    currentPrice: 120,
                    change: 5,
                    percentChange: 1,
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
            ],
        });

        await useStockDataStore.getState().fetchQuotes();

        expect(useStockDataStore.getState().warnings).toContain("部分報價缺失：AAPL");
        expect(useStockDataStore.getState().stocks).toEqual([]);
    });
});
