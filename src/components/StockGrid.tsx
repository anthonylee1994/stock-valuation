import React from "react";
import type {StockWithQuote} from "@/types";
import {EmptyPlaceholder} from "./EmptyPlaceholder";
import {StockCard} from "./StockCard";

interface Props {
    stocks: StockWithQuote[];
}

export const StockGrid = React.memo<Props>(({stocks}) => {
    if (stocks.length === 0) {
        return <EmptyPlaceholder />;
    }

    return (
        <main className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:gap-4">
            {stocks.map(stock => (
                <StockCard key={stock.symbol} stock={stock} />
            ))}
        </main>
    );
});
