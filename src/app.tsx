import React, {useEffect} from "react";
import {Header} from "./components/Header";
import {SortButtonGroup} from "./components/SortButtonGroup";
import {StockGrid} from "./components/StockGrid";
import {LoadingSpinner} from "./components/LoadingSpinner";
import {useStockStore} from "./store/useStockStore";
import {sortStocks} from "./utils/sortStocks";
import {valuationData} from "./valuation";

export const App = () => {
    const stocks = useStockStore(state => state.stocks);
    const loading = useStockStore(state => state.loading);
    const pulse = useStockStore(state => state.pulse);
    const lastUpdate = useStockStore(state => state.lastUpdate);
    const sortOrder = useStockStore(state => state.sortOrder);
    const marketFilter = useStockStore(state => state.marketFilter);
    const setSortOrder = useStockStore(state => state.setSortOrder);
    const setMarketFilter = useStockStore(state => state.setMarketFilter);
    const startPolling = useStockStore(state => state.startPolling);

    const symbols = valuationData.stocks.map(s => s.symbol).join(",");

    useEffect(() => {
        const cleanup = startPolling(symbols, valuationData.stocks);
        return cleanup;
    }, [symbols, startPolling]);

    const filteredStocks = stocks.filter(stock => {
        if (marketFilter === "hk") return stock.market === "HK";
        if (marketFilter === "us") return stock.market === "US";
    });

    const sortedStocks = sortStocks(filteredStocks, sortOrder);

    return (
        <div className="min-h-screen text-slate-200 p-6 max-[640px]:p-4">
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
