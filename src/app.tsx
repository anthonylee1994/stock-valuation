import {usePolling} from "@/hooks/usePolling";
import React from "react";
import {ErrorDisplay} from "./components/ErrorDisplay";
import {Header} from "./components/Header";
import {LoadingSpinner} from "./components/LoadingSpinner";
import {SortButtonGroup} from "./components/SortButtonGroup";
import {StockGrid} from "./components/StockGrid";
import {useFilteredAndSortedStocks} from "./hooks/useFilteredAndSortedStocks";
import {useStockDataStore} from "./stores/useStockDataStore";
import {useStockPreferencesStore} from "./stores/useStockPreferencesStore";

export const App = React.memo(() => {
    const error = useStockDataStore(state => state.error);
    const retryFetch = useStockDataStore(state => state.retryFetch);
    const loading = useStockDataStore(state => state.loading);
    const pulse = useStockDataStore(state => state.pulse);
    const lastUpdate = useStockDataStore(state => state.lastUpdate);

    const sortOrder = useStockPreferencesStore(state => state.sortOrder);
    const marketFilter = useStockPreferencesStore(state => state.marketFilter);
    const searchQuery = useStockPreferencesStore(state => state.searchQuery);
    const setSortOrder = useStockPreferencesStore(state => state.setSortOrder);
    const setMarketFilter = useStockPreferencesStore(state => state.setMarketFilter);
    const setSearchQuery = useStockPreferencesStore(state => state.setSearchQuery);
    const sortedStocks = useFilteredAndSortedStocks(marketFilter, sortOrder, searchQuery);
    const isInitialLoading = loading && sortedStocks.length === 0;

    usePolling();

    if (error) {
        return <ErrorDisplay error={error} resetErrorBoundary={retryFetch} />;
    }

    return (
        <div className="min-h-screen p-6 max-[640px]:p-4 mb-[env(safe-area-inset-bottom)]">
            <Header lastUpdate={lastUpdate} pulse={pulse} />
            {isInitialLoading ? (
                <LoadingSpinner />
            ) : (
                <React.Fragment>
                    <SortButtonGroup
                        sortOrder={sortOrder}
                        onSortOrderChange={setSortOrder}
                        marketFilter={marketFilter}
                        onMarketFilterChange={setMarketFilter}
                        searchQuery={searchQuery}
                        onSearchQueryChange={setSearchQuery}
                    />
                    <StockGrid stocks={sortedStocks} />
                </React.Fragment>
            )}
        </div>
    );
});
