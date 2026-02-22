import React from "react";
import {StockCard} from "./StockCard";
import type {StockWithQuote} from "@/types";

interface Props {
    stocks: StockWithQuote[];
}

export const StockGrid = React.memo<Props>(({stocks}) => {
    return (
        <main className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] sm:gap-5 max-w-[1400px] mx-auto">
            {stocks.map(stock => (
                <StockCard key={stock.symbol} stock={stock} />
            ))}
        </main>
    );
});
