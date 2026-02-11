import React, {useState, useEffect} from "react";
import {Header} from "./components/Header";
import {SortButtonGroup} from "./components/SortButtonGroup";
import {StockGrid} from "./components/StockGrid";
import {LoadingSpinner} from "./components/LoadingSpinner";
import {useStockQuotes} from "./hooks/useStockQuotes";
import {sortStocks} from "./utils/sortStocks";
import {valuationData} from "./valuation";

const SORT_ORDER_KEY = "stock-valuation-sort-order";

export const App = () => {
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() => {
        const saved = localStorage.getItem(SORT_ORDER_KEY);
        return saved === "asc" || saved === "desc" ? saved : "asc";
    });

    const data = valuationData;
    const symbols = data.stocks.map(s => s.symbol).join(",");

    const {data: stocks, lastUpdate, loading, pulse} = useStockQuotes(symbols, data.stocks);
    const sortedStocks = sortStocks(stocks, sortOrder);

    useEffect(() => {
        localStorage.setItem(SORT_ORDER_KEY, sortOrder);
    }, [sortOrder]);

    return (
        <div className="min-h-screen text-slate-200 p-6 max-[640px]:p-4">
            <Header lastUpdate={lastUpdate} pulse={pulse} />
            {loading && stocks.length === 0 ? (
                <LoadingSpinner />
            ) : (
                <React.Fragment>
                    <SortButtonGroup sortOrder={sortOrder} onSortOrderChange={setSortOrder} />
                    <StockGrid stocks={sortedStocks} />
                </React.Fragment>
            )}
        </div>
    );
};
