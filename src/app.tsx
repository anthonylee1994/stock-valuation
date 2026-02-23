import React from "react";
import {Header} from "./components/Header";
import {SortButtonGroup} from "./components/SortButtonGroup";
import {StockGrid} from "./components/StockGrid";
import {LoadingSpinner} from "./components/LoadingSpinner";
import {ErrorDisplay} from "./components/ErrorDisplay";
import {useStockDataStore} from "./stores/useStockDataStore";
import {useStockPreferencesStore} from "./stores/useStockPreferencesStore";
import {useFilteredAndSortedStocks} from "./hooks/useFilteredAndSortedStocks";
import {usePolling} from "@/hooks/usePolling";

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
                <>
                    <SortButtonGroup sortOrder={sortOrder} onSortOrderChange={setSortOrder} marketFilter={marketFilter} onMarketFilterChange={setMarketFilter} />
                    <StockGrid stocks={sortedStocks} />
                </>
            )}
        </div>
    );
});
