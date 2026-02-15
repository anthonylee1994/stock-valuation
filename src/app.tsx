import React, {useEffect, useMemo} from "react";
import {Header} from "./components/Header";
import {SortButtonGroup} from "./components/SortButtonGroup";
import {StockGrid} from "./components/StockGrid";
import {LoadingSpinner} from "./components/LoadingSpinner";
import {useStockStore} from "./store/useStockStore";
import {sortStocks} from "./utils/sortStocks";
import {valuationData} from "./valuation";

export const App = () => {
    // 用 shallow comparison，避免每次 render 都創建新 object
    const {stocks, loading, pulse, lastUpdate, sortOrder, marketFilter, setSortOrder, setMarketFilter, startPolling} = useStockStore(
        state => ({
            stocks: state.stocks,
            loading: state.loading,
            pulse: state.pulse,
            lastUpdate: state.lastUpdate,
            sortOrder: state.sortOrder,
            marketFilter: state.marketFilter,
            setSortOrder: state.setSortOrder,
            setMarketFilter: state.setMarketFilter,
            startPolling: state.startPolling,
        })
    );

    const symbols = useMemo(() => valuationData.stocks.map(s => s.symbol).join(","), []);

    useEffect(() => {
        const cleanup = startPolling(symbols, valuationData.stocks);
        return cleanup;
    }, [symbols, startPolling]);

    // 用 useMemo cache filtered & sorted stocks，避免每次 render 都重新計算
    const sortedStocks = useMemo(() => {
        const filtered = stocks.filter(stock => {
            if (marketFilter === "hk") return stock.market === "HK";
            if (marketFilter === "us") return stock.market === "US";
            return true;
        });
        return sortStocks(filtered, sortOrder);
    }, [stocks, marketFilter, sortOrder]);

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
