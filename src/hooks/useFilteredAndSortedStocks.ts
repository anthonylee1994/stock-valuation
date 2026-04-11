import React from "react";
import type {MarketFilter} from "@/types";
import {useStockDataStore} from "@/stores/useStockDataStore";
import {sortStocks} from "@/utils/stockHelpers";
import {useDebounce} from "./useDebounce";

export function useFilteredAndSortedStocks(marketFilter: MarketFilter, sortOrder: "asc" | "desc", searchQuery: string = "") {
    const stocks = useStockDataStore(state => state.stocks);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    return React.useMemo(() => {
        let filtered = stocks.filter(stock => stock.market === marketFilter);

        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase().trim();
            filtered = filtered.filter(stock => stock.symbol.toLowerCase().includes(query) || stock.name?.toLowerCase().includes(query));
        }

        return sortStocks(filtered, sortOrder);
    }, [stocks, marketFilter, sortOrder, debouncedSearchQuery]);
}
