import {useStockDataStore} from "@/stores/useStockDataStore";
import {useEffect} from "react";

export const usePolling = () => {
    useEffect(() => {
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
};
