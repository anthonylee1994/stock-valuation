import {useStockDataStore} from "@/stores/useStockDataStore";
import {DEDUPED_STOCKS, SYMBOLS} from "@/constants/stockConstants";
import {useEffect} from "react";

export const usePolling = () => {
    useEffect(() => {
        const {startPolling} = useStockDataStore.getState();
        const cleanup = startPolling(SYMBOLS, DEDUPED_STOCKS);
        return cleanup;
    }, []);
};
