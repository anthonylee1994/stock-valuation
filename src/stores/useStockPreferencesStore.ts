import {create} from "zustand";
import {getStorageValue, setStorageValue, createStringValidator} from "@/utils/storage";

const SORT_ORDER_KEY = "stock-valuation-sort-order";
const MARKET_FILTER_KEY = "stock-valuation-market-filter";

const sortOrderValidator = createStringValidator(["asc", "desc"]);
const marketFilterValidator = createStringValidator(["hk_market", "us_market"]);

function getStoredSortOrder(): "asc" | "desc" {
    return getStorageValue(SORT_ORDER_KEY, "asc", sortOrderValidator);
}

function getStoredMarketFilter(): string {
    return getStorageValue(MARKET_FILTER_KEY, "us_market", marketFilterValidator);
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
        setStorageValue(SORT_ORDER_KEY, sortOrder);
        set({sortOrder});
    },

    setMarketFilter: marketFilter => {
        setStorageValue(MARKET_FILTER_KEY, marketFilter);
        set({marketFilter});
    },
}));
