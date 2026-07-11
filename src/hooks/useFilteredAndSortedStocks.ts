import React from "react";
import type {MarketFilter, Sector} from "@/types";
import {useStockDataStore} from "@/stores/useStockDataStore";
import {filterValuationStocks, sortStocks} from "@/utils/stockHelpers";
import {useDebounce} from "./useDebounce";

export function useFilteredAndSortedStocks(marketFilter: MarketFilter, sectorFilter: Sector | null, sortOrder: "asc" | "desc", searchQuery: string = "") {
    const stocks = useStockDataStore(state => state.stocks);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    return React.useMemo(() => {
        let filtered = filterValuationStocks(stocks, marketFilter, sectorFilter);

        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase().trim();
            filtered = filtered.filter(stock => stock.symbol.toLowerCase().includes(query) || stock.name?.toLowerCase().includes(query));
        }

        return sortStocks(filtered, sortOrder);
    }, [stocks, marketFilter, sectorFilter, sortOrder, debouncedSearchQuery]);
}
