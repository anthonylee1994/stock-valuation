import React from "react";
import {useStockDataStore} from "@/stores/useStockDataStore";
import type {MarketFilter, Sector} from "@/types";

export function usePolling(marketFilter: MarketFilter, sectorFilter: Sector | null) {
    const isInitialFilterRender = React.useRef(true);

    React.useEffect(() => {
        const {fetchValuationData, startPolling} = useStockDataStore.getState();
        let cancelled = false;
        let cleanup: (() => void) | undefined;

        void fetchValuationData().then(() => {
            if (cancelled) {
                return;
            }

            cleanup = startPolling();
        });

        return () => {
            cancelled = true;
            cleanup?.();
        };
    }, []);

    React.useEffect(() => {
        if (isInitialFilterRender.current) {
            isInitialFilterRender.current = false;
            return;
        }

        void useStockDataStore.getState().fetchQuotes();
    }, [marketFilter, sectorFilter]);
}
