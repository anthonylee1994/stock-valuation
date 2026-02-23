import React, {useEffect, useMemo} from "react";
import {Header} from "./components/Header";
import {SortButtonGroup} from "./components/SortButtonGroup";
import {StockGrid} from "./components/StockGrid";
import {LoadingSpinner} from "./components/LoadingSpinner";
import {ErrorDisplay} from "./components/ErrorDisplay";
import {useStockDataStore} from "./stores/useStockDataStore";
import {useStockPreferencesStore} from "./stores/useStockPreferencesStore";
import {getUniqueSymbols, sortStocks} from "./utils/stockHelpers";
import {valuationData} from "./valuation";

const SYMBOLS = getUniqueSymbols(valuationData.stocks);
const STOCKS_DATA = valuationData.stocks;

export const App = () => {
    const {stocks, error, retryFetch, loading, pulse, lastUpdate, startPolling} = useStockDataStore();
    const {sortOrder, marketFilter, setSortOrder, setMarketFilter} = useStockPreferencesStore();

    useEffect(() => {
        const cleanup = startPolling(SYMBOLS, STOCKS_DATA);
        return cleanup;
    }, []);

    const filteredStocks = useMemo(() => stocks.filter(stock => stock.market === marketFilter), [stocks, marketFilter]);
    const sortedStocks = useMemo(() => sortStocks(filteredStocks, sortOrder), [filteredStocks, sortOrder]);

    if (error) {
        return <ErrorDisplay error={error} onRetry={retryFetch} />;
    }

    return (
        <div className="min-h-screen p-6 max-[640px]:p-4 mb-[env(safe-area-inset-bottom)]">
            <Header lastUpdate={lastUpdate} pulse={pulse} />
            {loading && stocks.length === 0 ? (
                <LoadingSpinner />
            ) : (
                <React.Fragment>
                    <SortButtonGroup sortOrder={sortOrder} onSortOrderChange={setSortOrder} marketFilter={marketFilter} onMarketFilterChange={setMarketFilter} />
                    <StockGrid stocks={sortedStocks} />
                </React.Fragment>
            )}
        </div>
    );
};
