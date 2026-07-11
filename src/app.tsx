import React from "react";
import {usePolling} from "@/hooks/usePolling";
import type {MarketFilter, Sector} from "@/types";
import {filterValuationStocks} from "@/utils/stockHelpers";
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
    const initialLoading = useStockDataStore(state => state.initialLoading);
    const loading = useStockDataStore(state => state.loading);
    const warnings = useStockDataStore(state => state.warnings);
    const valuationStocks = useStockDataStore(state => state.valuationStocks);

    const sortOrder = useStockPreferencesStore(state => state.sortOrder);
    const marketFilter = useStockPreferencesStore(state => state.marketFilter);
    const sectorFilter = useStockPreferencesStore(state => state.sectorFilter);
    const searchQuery = useStockPreferencesStore(state => state.searchQuery);
    const setSortOrder = useStockPreferencesStore(state => state.setSortOrder);
    const setMarketFilter = useStockPreferencesStore(state => state.setMarketFilter);
    const setSectorFilter = useStockPreferencesStore(state => state.setSectorFilter);
    const setSearchQuery = useStockPreferencesStore(state => state.setSearchQuery);
    const sectors = React.useMemo(
        () => Array.from(new Set(filterValuationStocks(valuationStocks, marketFilter, null).map(stock => stock.sector))).sort((a, b) => a.localeCompare(b, "zh-HK")),
        [valuationStocks, marketFilter]
    );
    const sortedStocks = useFilteredAndSortedStocks(marketFilter, sectorFilter, sortOrder, searchQuery);

    const handleMarketFilterChange = (market: MarketFilter) => {
        setMarketFilter(market);
        setSectorFilter(null);
    };

    const handleSectorFilterChange = (sector: Sector | null) => {
        setSectorFilter(sector);
    };

    React.useEffect(() => {
        if (valuationStocks.length > 0 && sectorFilter !== null && !sectors.includes(sectorFilter)) {
            setSectorFilter(null);
        }
    }, [sectorFilter, sectors, setSectorFilter, valuationStocks.length]);

    usePolling(marketFilter, sectorFilter);

    if (error) {
        return <ErrorDisplay error={error} resetErrorBoundary={retryFetch} />;
    }

    return (
        <React.Fragment>
            <Header warnings={warnings} />
            <div className="mb-[env(safe-area-inset-bottom)] p-3 sm:p-4">
                {initialLoading ? (
                    <LoadingSpinner />
                ) : (
                    <React.Fragment>
                        <SortButtonGroup
                            sortOrder={sortOrder}
                            onSortOrderChange={setSortOrder}
                            marketFilter={marketFilter}
                            onMarketFilterChange={handleMarketFilterChange}
                            sectors={sectors}
                            sectorFilter={sectorFilter}
                            onSectorFilterChange={handleSectorFilterChange}
                            searchQuery={searchQuery}
                            onSearchQueryChange={setSearchQuery}
                        />
                        <StockGrid stocks={sortedStocks} loading={loading} />
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
});
