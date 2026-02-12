import React, {useState, useEffect} from "react";
import {Header} from "./components/Header";
import {SortButtonGroup} from "./components/SortButtonGroup";
import {StockGrid} from "./components/StockGrid";
import {LoadingSpinner} from "./components/LoadingSpinner";
import {useStockQuotes} from "./hooks/useStockQuotes";
import {sortStocks} from "./utils/sortStocks";
import {valuationData} from "./valuation";

const SORT_ORDER_KEY = "stock-valuation-sort-order";
const MARKET_FILTER_KEY = "stock-valuation-market-filter";

export const App = () => {
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() => {
        const saved = localStorage.getItem(SORT_ORDER_KEY);
        return saved === "asc" || saved === "desc" ? saved : "asc";
    });

    const [marketFilter, setMarketFilter] = useState<"hk" | "us">(() => {
        const saved = localStorage.getItem(MARKET_FILTER_KEY);
        return saved === "hk" || saved === "us" ? saved : "us";
    });

    const data = valuationData;
    const symbols = data.stocks.map(s => s.symbol).join(",");

    const {data: stocks, loading, pulse, lastUpdate} = useStockQuotes(symbols, data.stocks);

    // Filter stocks by market
    const filteredStocks = stocks.filter(stock => {
        if (marketFilter === "hk") return stock.market === "HK";
        if (marketFilter === "us") return stock.market === "US";
    });

    const sortedStocks = sortStocks(filteredStocks, sortOrder);

    useEffect(() => {
        localStorage.setItem(SORT_ORDER_KEY, sortOrder);
    }, [sortOrder]);

    useEffect(() => {
        localStorage.setItem(MARKET_FILTER_KEY, marketFilter);
    }, [marketFilter]);

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
