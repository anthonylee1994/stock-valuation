import {create} from "zustand";
import {persist} from "zustand/middleware";

interface StockPreferencesState {
    sortOrder: "asc" | "desc";
    marketFilter: string;
}

interface StockPreferencesActions {
    setSortOrder: (sortOrder: "asc" | "desc") => void;
    setMarketFilter: (marketFilter: string) => void;
}

type StockPreferencesStore = StockPreferencesState & StockPreferencesActions;

export const useStockPreferencesStore = create<StockPreferencesStore>()(
    persist(
        set => ({
            sortOrder: "asc",
            marketFilter: "us_market",
            setSortOrder: sortOrder => set({sortOrder}),
            setMarketFilter: marketFilter => set({marketFilter}),
        }),
        {name: "stock-valuation-preferences"}
    )
);
