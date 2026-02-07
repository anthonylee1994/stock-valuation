import React, {useState} from "react";
import valuationData from "./valuation.json";
import {Header} from "./components/Header";
import {SortButtonGroup} from "./components/SortButtonGroup";
import {StockGrid} from "./components/StockGrid";
import {LoadingSpinner} from "./components/LoadingSpinner";
import {useStockQuotes} from "./hooks/useStockQuotes";
import {sortStocks} from "./utils/sortStocks";
import type {ValuationData} from "./types";

export const App = () => {
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const data = valuationData as ValuationData;
    const symbols = data.stocks.map(s => s.symbol).join(",");

    const {data: stocks, lastUpdate, loading, pulse} = useStockQuotes(symbols, data.stocks);
    const sortedStocks = sortStocks(stocks, sortOrder);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 max-[640px]:p-4">
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
