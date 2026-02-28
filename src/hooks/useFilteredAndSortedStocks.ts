import {useStockDataStore} from "@/stores/useStockDataStore";
import {sortStocks} from "@/utils/stockHelpers";
import {useMemo} from "react";

export const useFilteredAndSortedStocks = (marketFilter: string, sortOrder: "asc" | "desc", searchQuery: string = "") => {
    const stocks = useStockDataStore(state => state.stocks);

    return useMemo(() => {
        let filtered = stocks.filter(stock => stock.market === marketFilter);

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(stock => stock.symbol.toLowerCase().includes(query));
        }

        return sortStocks(filtered, sortOrder);
    }, [stocks, marketFilter, sortOrder, searchQuery]);
};
