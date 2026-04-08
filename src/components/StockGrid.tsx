import type {StockWithQuote} from "@/types";
import React from "react";
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
        <main className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] sm:gap-5 max-w-350 mx-auto">
            {stocks.map(stock => (
                <StockCard key={stock.symbol} stock={stock} />
            ))}
        </main>
    );
});
