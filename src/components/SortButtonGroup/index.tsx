import React from "react";
import type {MarketFilter} from "@/types";
import {SearchField} from "@heroui/react";
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
        <div className="mx-auto mb-4 flex max-w-[1600px] flex-wrap items-center justify-between gap-3 font-mono">
            <div className="flex w-full flex-wrap items-center justify-between gap-4 md:w-auto md:justify-start">
                <Tabs ariaLabel="排序方式" value={sortOrder} setValue={onSortOrderChange} items={{asc: "由殘到貴", desc: "由貴到殘"}} />
                <Tabs ariaLabel="市場篩選" value={marketFilter} setValue={onMarketFilterChange} items={{us_market: "美股", hk_market: "港股"}} />
            </div>
            <SearchField aria-label="搜尋股票" autoFocus value={searchQuery} onChange={onSearchQueryChange} variant="secondary" className="w-full gap-0 md:w-80">
                <SearchField.Group className="h-9 rounded-[2px] border border-zinc-700 bg-[#050505] shadow-none focus-within:ring-1 focus-within:ring-amber-400 focus-within:ring-offset-0">
                    <SearchField.SearchIcon className="text-zinc-500" />
                    <SearchField.Input placeholder="尋找股票代號或名稱" className="font-mono text-[12px] font-bold text-zinc-50 placeholder:text-zinc-300" />
                    <SearchField.ClearButton className="m-0 h-10 w-8 rounded-none text-zinc-400 [&_svg]:h-4 [&_svg]:w-4" />
                </SearchField.Group>
            </SearchField>
        </div>
    );
});
