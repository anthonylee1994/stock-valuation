import {useStockDataStore} from "@/stores/useStockDataStore";
import {useEffect} from "react";

export const usePolling = () => {
    useEffect(() => {
        const {fetchValuationData, startPolling} = useStockDataStore.getState();

        // First fetch valuation data from Google Sheets
        fetchValuationData().then(() => {
            // Then start polling for quotes
            const cleanup = startPolling();
            return cleanup;
        });
    }, []);
};
