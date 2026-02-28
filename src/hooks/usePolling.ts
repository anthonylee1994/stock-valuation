import {useStockDataStore} from "@/stores/useStockDataStore";
import {getUniqueSymbols, validateAndDeduplicateStocks} from "@/utils/stockHelpers";
import {valuationData} from "@/valuation";
import {useEffect} from "react";

// Pre-compute at module level
const DEDUPED_STOCKS = validateAndDeduplicateStocks(valuationData.stocks);
const SYMBOLS = getUniqueSymbols(DEDUPED_STOCKS);

export const usePolling = () => {
    useEffect(() => {
        const {startPolling} = useStockDataStore.getState();
        const cleanup = startPolling(SYMBOLS, DEDUPED_STOCKS);
        return cleanup;
    }, []);
};
