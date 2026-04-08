import type {StockWithQuote} from "@/types";
import React from "react";
import {EmptyPlaceholder} from "./EmptyPlaceholder";
import {StockCard} from "./StockCard";

interface Props {
    stocks: StockWithQuote[];
    hasConfiguredStocks: boolean;
    isFiltered: boolean;
    marketFilter: "us_market" | "hk_market";
}

export const StockGrid = React.memo<Props>(({stocks, hasConfiguredStocks, isFiltered, marketFilter}) => {
    if (stocks.length === 0) {
        if (!hasConfiguredStocks) {
            return <EmptyPlaceholder title="未有追蹤股票" description="請先喺 Google Sheets 加入估值資料，之後畫面先會顯示追蹤清單。" />;
        }

        if (isFiltered) {
            return <EmptyPlaceholder />;
        }

        return <EmptyPlaceholder title={`目前冇 ${marketFilter === "us_market" ? "美股" : "港股"} 追蹤項目`} description="請切換市場，或者去 Google Sheets 更新追蹤清單。" />;
    }

    return (
        <main className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] sm:gap-5 max-w-350 mx-auto">
            {stocks.map(stock => (
                <StockCard key={stock.symbol} stock={stock} />
            ))}
        </main>
    );
});
