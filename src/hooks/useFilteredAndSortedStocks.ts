import {useMemo} from "react";
import {useStockDataStore} from "../stores/useStockDataStore";
import {sortStocks} from "../utils/stockHelpers";

export const useFilteredAndSortedStocks = (marketFilter: string, sortOrder: "asc" | "desc") => {
    const {stocks} = useStockDataStore();

    return useMemo(() => {
        const filtered = stocks.filter(stock => stock.market === marketFilter);
        return sortStocks(filtered, sortOrder);
    }, [stocks, marketFilter, sortOrder]);
};
