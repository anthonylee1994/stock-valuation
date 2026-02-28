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
    const {error, retryFetch, loading, pulse, lastUpdate} = useStockDataStore();
    const {sortOrder, marketFilter, setSortOrder, setMarketFilter} = useStockPreferencesStore();
    const sortedStocks = useFilteredAndSortedStocks(marketFilter, sortOrder);
    const isInitialLoading = loading && sortedStocks.length === 0;

    usePolling();

    if (error) {
        return <ErrorDisplay error={error} onRetry={retryFetch} />;
    }

    return (
        <div className="min-h-screen p-6 max-[640px]:p-4 mb-[env(safe-area-inset-bottom)]">
            <Header lastUpdate={lastUpdate} pulse={pulse} />
            {isInitialLoading ? (
                <LoadingSpinner />
            ) : (
                <React.Fragment>
                    <SortButtonGroup sortOrder={sortOrder} onSortOrderChange={setSortOrder} marketFilter={marketFilter} onMarketFilterChange={setMarketFilter} />
                    <StockGrid stocks={sortedStocks} />
                </React.Fragment>
            )}
        </div>
    );
});
