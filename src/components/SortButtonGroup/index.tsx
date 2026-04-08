import type {MarketFilter} from "@/types";
import {SearchField} from "@heroui/react";
import React from "react";
import {Tabs} from "./Tabs";

interface Props {
    sortOrder: "asc" | "desc";
    onSortOrderChange: (order: "asc" | "desc") => void;
    marketFilter: MarketFilter;
    onMarketFilterChange: (market: MarketFilter) => void;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
}

export const SortButtonGroup = React.memo<Props>(({sortOrder, onSortOrderChange, marketFilter, onMarketFilterChange, searchQuery, onSearchQueryChange}) => {
    return (
        <div className="mx-auto mb-6 flex max-w-350 flex-wrap items-center justify-between gap-4">
            <div className="flex w-full flex-wrap items-center justify-between gap-4 md:w-auto md:justify-start">
                <Tabs value={sortOrder} setValue={onSortOrderChange} items={{asc: "由殘到貴", desc: "由貴到殘"}} />
                <Tabs value={marketFilter} setValue={onMarketFilterChange} items={{us_market: "美股", hk_market: "港股"}} />
            </div>
            <SearchField autoFocus value={searchQuery} onChange={onSearchQueryChange} className="gap-4 w-full md:w-auto">
                <SearchField.Group className="h-10 rounded-full focus-within:ring-0 focus-within:ring-offset-0">
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="尋找股票代號或名稱" className="text-sm" />
                    <SearchField.ClearButton className="right-1" />
                </SearchField.Group>
            </SearchField>
        </div>
    );
});
