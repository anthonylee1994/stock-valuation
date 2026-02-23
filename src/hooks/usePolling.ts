import {useStockDataStore} from "@/stores/useStockDataStore";
import {getUniqueSymbols} from "@/utils/stockHelpers";
import {valuationData} from "@/valuation";
import {useEffect} from "react";

const SYMBOLS = getUniqueSymbols(valuationData.stocks);
const STOCKS_DATA = valuationData.stocks;

export const usePolling = () => {
    const {startPolling} = useStockDataStore();

    useEffect(() => {
        const cleanup = startPolling(SYMBOLS, STOCKS_DATA);
        return cleanup;
    }, [startPolling]);
};
