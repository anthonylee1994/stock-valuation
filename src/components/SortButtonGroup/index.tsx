import {SearchField} from "@heroui/react";
import React from "react";
import {Tabs} from "./Tabs";

interface Props {
    sortOrder: "asc" | "desc";
    onSortOrderChange: (order: "asc" | "desc") => void;
    marketFilter: "us_market" | "hk_market";
    onMarketFilterChange: (market: "us_market" | "hk_market") => void;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
}

export const SortButtonGroup = React.memo<Props>(({sortOrder, onSortOrderChange, marketFilter, onMarketFilterChange, searchQuery, onSearchQueryChange}) => (
    <div className="mx-auto mb-6 flex max-w-350 flex-wrap items-center justify-between gap-4">
        <div className="flex w-full flex-wrap items-center justify-between gap-4 sm:w-auto md:justify-start">
            <Tabs value={sortOrder} setValue={onSortOrderChange} items={{asc: "由殘到貴", desc: "由貴到殘"}} />
            <Tabs value={marketFilter} setValue={onMarketFilterChange} items={{us_market: "美股", hk_market: "港股"}} />
        </div>
        <SearchField value={searchQuery} onChange={onSearchQueryChange} className="w-full sm:w-auto">
            <SearchField.Group className="h-10 rounded-full">
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="尋找股票代號" className="text-sm" />
                <SearchField.ClearButton />
            </SearchField.Group>
        </SearchField>
    </div>
));
