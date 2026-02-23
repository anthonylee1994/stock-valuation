import {create} from "zustand";

const SORT_ORDER_KEY = "stock-valuation-sort-order";
const MARKET_FILTER_KEY = "stock-valuation-market-filter";

function getStoredSortOrder(): "asc" | "desc" {
    const saved = localStorage.getItem(SORT_ORDER_KEY);
    return saved === "asc" || saved === "desc" ? saved : "asc";
}

function getStoredMarketFilter(): string {
    const saved = localStorage.getItem(MARKET_FILTER_KEY);
    return saved === "hk_market" || saved === "us_market" ? saved : "us_market";
}

interface StockPreferencesStore {
    sortOrder: "asc" | "desc";
    marketFilter: string;
    setSortOrder: (sortOrder: "asc" | "desc") => void;
    setMarketFilter: (marketFilter: string) => void;
}

export const useStockPreferencesStore = create<StockPreferencesStore>(set => ({
    sortOrder: getStoredSortOrder(),
    marketFilter: getStoredMarketFilter(),

    setSortOrder: sortOrder => {
        localStorage.setItem(SORT_ORDER_KEY, sortOrder);
        set({sortOrder});
    },

    setMarketFilter: marketFilter => {
        localStorage.setItem(MARKET_FILTER_KEY, marketFilter);
        set({marketFilter});
    },
}));
