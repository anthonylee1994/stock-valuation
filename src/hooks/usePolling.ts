import React from "react";
import {useStockDataStore} from "@/stores/useStockDataStore";

export function usePolling() {
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
}
