import React, {useEffect, useMemo} from "react";
import {Header} from "./components/Header";
import {SortButtonGroup} from "./components/SortButtonGroup";
import {StockGrid} from "./components/StockGrid";
import {LoadingSpinner} from "./components/LoadingSpinner";
import {useStockStore} from "./store/useStockStore";
import {sortStocks} from "./utils/sortStocks";
import {valuationData} from "./valuation";

const SYMBOLS = valuationData.stocks.map(s => s.symbol).join(",");
const STOCKS_DATA = valuationData.stocks;

export const App = () => {
    const {stocks, loading, pulse, lastUpdate, sortOrder, marketFilter, setSortOrder, setMarketFilter, startPolling} = useStockStore();

    useEffect(() => {
        const cleanup = startPolling(SYMBOLS, STOCKS_DATA);
        return cleanup;
    }, []);

    const filteredStocks = useMemo(() => {
        return stocks.filter(stock => {
            if (marketFilter === "hk") return stock.market === "HK";
            if (marketFilter === "us") return stock.market === "US";
            return false;
        });
    }, [stocks, marketFilter]);

    const sortedStocks = useMemo(() => {
        return sortStocks(filteredStocks, sortOrder);
    }, [filteredStocks, sortOrder]);

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
