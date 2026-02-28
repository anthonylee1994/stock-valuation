import {useStockDataStore} from "@/stores/useStockDataStore";
import {sortStocks} from "@/utils/stockHelpers";
import {useMemo} from "react";

export const useFilteredAndSortedStocks = (marketFilter: string, sortOrder: "asc" | "desc") => {
    const {stocks} = useStockDataStore();

    return useMemo(() => {
        const filtered = stocks.filter(stock => stock.market === marketFilter);
        return sortStocks(filtered, sortOrder);
    }, [stocks, marketFilter, sortOrder]);
};
