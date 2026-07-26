import {POLLING_INTERVAL} from "@/constants/stockConstants";
import {useStockPreferencesStore} from "@/stores/useStockPreferencesStore";
import type {ApiQuotesResponse, Quote, StockWithQuote, ValuationStock} from "@/types";
import {getJson} from "@/utils/api";
import {filterValuationStocks, getActivePrice, getUniqueSymbols, validateAndDeduplicateStocks} from "@/utils/stockHelpers";
import {fetchValuationData} from "@/valuation";
import {create} from "zustand";

let latestQuotesRequestId = 0;
let activeQuotesAbortController: AbortController | null = null;
const MISSING_QUOTES_WARNING_PREFIX = "部分報價缺失：";
const UPDATE_ERROR_WARNING_PREFIX = "報價更新失敗：";

function calculatePotentialPercent(targetPrice: number, currentPrice: number) {
    if (currentPrice === 0) {
        return 0;
    }

    return ((targetPrice - currentPrice) / currentPrice) * 100;
}

function mergeStocksWithQuotes(stocks: ValuationStock[], quotes: Quote[]) {
    const quoteMap = new Map<string, Quote>();
    const missingSymbols: string[] = [];

    quotes.forEach(quote => {
        quoteMap.set(quote.symbol, quote);
    });

    const mergedStocks = stocks
        .map(stock => {
            const quote = quoteMap.get(stock.symbol);
            if (!quote) {
                missingSymbols.push(stock.symbol);
                return null;
            }
            const mergedStock: StockWithQuote = {
                ...stock,
                ...quote,
                name: stock.name ?? quote.name ?? stock.symbol,
            };
            const activePrice = getActivePrice(mergedStock).price;

            return {
                ...mergedStock,
                potentialDownside: calculatePotentialPercent(stock.valuationLow, activePrice),
                potentialUpside: calculatePotentialPercent(stock.valuationHigh, activePrice),
            };
        })
        .filter((s): s is StockWithQuote => s !== null);

    return {
        stocks: mergedStocks,
        missingSymbols,
    };
}

interface FetchQuotesOptions {
    showLoading?: boolean;
}

export interface StockDataStore {
    stocks: StockWithQuote[];
    loading: boolean;
    initialLoading: boolean;
    error: Error | null;
    warnings: string[];
    valuationStocks: ValuationStock[];
    setStocks: (stocks: StockWithQuote[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: Error | null) => void;
    setWarnings: (warnings: string[]) => void;
    setValuationStocks: (stocks: ValuationStock[]) => void;
    fetchValuationData: () => Promise<boolean>;
    fetchQuotes: (options?: FetchQuotesOptions) => Promise<void>;
    startPolling: () => () => void;
    retryFetch: () => void;
}

export const useStockDataStore = create<StockDataStore>((set, get) => ({
    stocks: [],
    loading: true,
    initialLoading: true,
    error: null,
    warnings: [],
    valuationStocks: [],

    setStocks: stocks => set({stocks}),
    setLoading: loading => set({loading}),
    setError: error => set({error}),
    setWarnings: warnings => set({warnings}),
    setValuationStocks: valuationStocks => set({valuationStocks}),

    fetchValuationData: async () => {
        try {
            const data = await fetchValuationData();
            const deduped = validateAndDeduplicateStocks(data.stocks);
            set({
                valuationStocks: deduped,
                warnings: data.warnings,
            });
            return true;
        } catch (e) {
            console.error("Failed to fetch valuation data:", e);
            set({
                error: e instanceof Error ? e : new Error("無法載入估值數據"),
                loading: false,
                initialLoading: false,
            });
            return false;
        }
    },

    fetchQuotes: async ({showLoading = true} = {}) => {
        const {valuationStocks} = get();
        const {marketFilter, sectorFilter} = useStockPreferencesStore.getState();
        const filteredValuationStocks = filterValuationStocks(valuationStocks, marketFilter, sectorFilter);
        const requestId = latestQuotesRequestId + 1;
        latestQuotesRequestId = requestId;

        activeQuotesAbortController?.abort();

        if (filteredValuationStocks.length === 0) {
            activeQuotesAbortController = null;
            set({stocks: [], loading: false, initialLoading: false, error: null});
            return;
        }

        const symbols = getUniqueSymbols(filteredValuationStocks);
        const abortController = new AbortController();
        activeQuotesAbortController = abortController;
        set(showLoading ? {loading: true, error: null} : {error: null});

        try {
            const json = await getJson<ApiQuotesResponse>(`/quotes?symbols=${encodeURIComponent(symbols)}`, abortController.signal);

            if (!json.quotes || json.quotes.length === 0) {
                throw new Error("API 返回空數據。請稍後再試。");
            }

            if (requestId !== latestQuotesRequestId) {
                return;
            }

            const merged = mergeStocksWithQuotes(filteredValuationStocks, json.quotes);
            const warnings = [...get().warnings.filter(warning => !warning.startsWith(MISSING_QUOTES_WARNING_PREFIX) && !warning.startsWith(UPDATE_ERROR_WARNING_PREFIX))];

            if (merged.missingSymbols.length > 0) {
                warnings.push(`${MISSING_QUOTES_WARNING_PREFIX}${merged.missingSymbols.join(", ")}`);
            }

            set({
                stocks: merged.stocks,
                loading: false,
                initialLoading: false,
                error: null,
                warnings,
            });
        } catch (e) {
            if (abortController.signal.aborted || requestId !== latestQuotesRequestId) {
                return;
            }

            const error = e instanceof Error ? e : new Error("無法載入股票數據。請檢查網絡連接。");

            if (!showLoading && get().stocks.length > 0) {
                const warnings = get().warnings.filter(warning => !warning.startsWith(UPDATE_ERROR_WARNING_PREFIX));
                set({
                    loading: false,
                    warnings: [...warnings, `${UPDATE_ERROR_WARNING_PREFIX}${error.message}`],
                });
            } else {
                set({
                    error,
                    loading: false,
                    initialLoading: false,
                });
            }
        } finally {
            if (activeQuotesAbortController === abortController) {
                activeQuotesAbortController = null;
            }
        }
    },

    retryFetch: () => {
        const {fetchValuationData, fetchQuotes, valuationStocks} = get();

        if (valuationStocks.length === 0) {
            void fetchValuationData().then(loaded => {
                if (!loaded) {
                    return;
                }
                const {valuationStocks: latestValuationStocks} = get();
                if (latestValuationStocks.length > 0) {
                    void fetchQuotes();
                }
            });
            return;
        }

        void fetchQuotes();
    },

    startPolling: () => {
        const {fetchQuotes} = get();

        fetchQuotes();

        const interval = setInterval(() => {
            if (!document.hidden && !activeQuotesAbortController) {
                fetchQuotes({showLoading: false});
            }
        }, POLLING_INTERVAL);

        const handleVisibilityChange = () => {
            if (!document.hidden && !activeQuotesAbortController) {
                fetchQuotes({showLoading: false});
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            activeQuotesAbortController?.abort();
        };
    },
}));
