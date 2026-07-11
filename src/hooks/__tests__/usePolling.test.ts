import {renderHook, waitFor} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {usePolling} from "@/hooks/usePolling";
import {useStockDataStore} from "@/stores/useStockDataStore";
import type {StockDataStore} from "@/stores/useStockDataStore";
import type {MarketFilter, Sector} from "@/types";

vi.mock("@/stores/useStockDataStore", () => ({
    useStockDataStore: {
        getState: vi.fn(),
    },
}));

describe("usePolling", () => {
    const getState = vi.mocked(useStockDataStore.getState);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("starts polling after valuation data is loaded and cleans up on unmount", async () => {
        const cleanup = vi.fn();
        const fetchValuationData = vi.fn().mockResolvedValue(undefined);
        const startPolling = vi.fn().mockReturnValue(cleanup);

        getState.mockReturnValue({
            fetchValuationData,
            startPolling,
        } as unknown as StockDataStore);

        const {unmount} = renderHook(() => usePolling("us_market", null));

        await waitFor(() => {
            expect(fetchValuationData).toHaveBeenCalledTimes(1);
            expect(startPolling).toHaveBeenCalledTimes(1);
        });

        unmount();

        expect(cleanup).toHaveBeenCalledTimes(1);
    });

    it("does not start polling if the hook unmounts before valuation data resolves", async () => {
        let resolveFetch: (() => void) | undefined;
        const fetchValuationData = vi.fn(
            () =>
                new Promise<void>(resolve => {
                    resolveFetch = resolve;
                })
        );
        const startPolling = vi.fn();

        getState.mockReturnValue({
            fetchValuationData,
            startPolling,
        } as unknown as StockDataStore);

        const {unmount} = renderHook(() => usePolling("us_market", null));

        unmount();
        resolveFetch?.();
        await Promise.resolve();

        expect(startPolling).not.toHaveBeenCalled();
    });

    it("fetches fresh quotes when market or sector changes", async () => {
        const fetchValuationData = vi.fn().mockResolvedValue(undefined);
        const fetchQuotes = vi.fn().mockResolvedValue(undefined);
        const startPolling = vi.fn().mockReturnValue(vi.fn());

        getState.mockReturnValue({
            fetchValuationData,
            fetchQuotes,
            startPolling,
        } as unknown as StockDataStore);

        const {rerender} = renderHook(({marketFilter, sectorFilter}) => usePolling(marketFilter, sectorFilter), {
            initialProps: {marketFilter: "us_market" as MarketFilter, sectorFilter: null as Sector | null},
        });

        await waitFor(() => {
            expect(startPolling).toHaveBeenCalledTimes(1);
        });

        rerender({marketFilter: "hk_market", sectorFilter: "科技"});

        expect(fetchQuotes).toHaveBeenCalledTimes(1);
    });
});
