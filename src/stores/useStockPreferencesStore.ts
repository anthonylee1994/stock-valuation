import type {MarketFilter, Sector} from "@/types";
import {create} from "zustand";
import {persist} from "zustand/middleware";

interface StockPreferencesState {
    sortOrder: "asc" | "desc";
    marketFilter: MarketFilter;
    sectorFilter: Sector | null;
    searchQuery: string;
}

interface StockPreferencesActions {
    setSortOrder: (sortOrder: "asc" | "desc") => void;
    setMarketFilter: (marketFilter: MarketFilter) => void;
    setSectorFilter: (sectorFilter: Sector | null) => void;
    setSearchQuery: (searchQuery: string) => void;
}

type StockPreferencesStore = StockPreferencesState & StockPreferencesActions;

export const useStockPreferencesStore = create<StockPreferencesStore>()(
    persist(
        set => ({
            sortOrder: "asc",
            marketFilter: "us_market",
            sectorFilter: null,
            searchQuery: "",
            setSortOrder: sortOrder => set({sortOrder}),
            setMarketFilter: marketFilter => set({marketFilter}),
            setSectorFilter: sectorFilter => set({sectorFilter}),
            setSearchQuery: searchQuery => set({searchQuery}),
        }),
        {name: "stock-valuation-preferences"}
    )
);
