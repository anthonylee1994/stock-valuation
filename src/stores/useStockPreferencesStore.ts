import {create} from "zustand";
import {persist} from "zustand/middleware";

interface StockPreferencesState {
    sortOrder: "asc" | "desc";
    marketFilter: string;
    searchQuery: string;
}

interface StockPreferencesActions {
    setSortOrder: (sortOrder: "asc" | "desc") => void;
    setMarketFilter: (marketFilter: string) => void;
    setSearchQuery: (searchQuery: string) => void;
}

type StockPreferencesStore = StockPreferencesState & StockPreferencesActions;

export const useStockPreferencesStore = create<StockPreferencesStore>()(
    persist(
        set => ({
            sortOrder: "asc",
            marketFilter: "us_market",
            searchQuery: "",
            setSortOrder: sortOrder => set({sortOrder}),
            setMarketFilter: marketFilter => set({marketFilter}),
            setSearchQuery: searchQuery => set({searchQuery}),
        }),
        {name: "stock-valuation-preferences"}
    )
);
