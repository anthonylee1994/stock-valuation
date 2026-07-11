import React from "react";
import type {StockWithQuote} from "@/types";
import {EmptyPlaceholder} from "./EmptyPlaceholder";
import {StockCard} from "./StockCard";
import {Spinner} from "@heroui/react";

interface Props {
    loading: boolean;
    stocks: StockWithQuote[];
}

export const StockGrid = React.memo<Props>(({stocks, loading}) => {
    if (!loading && stocks.length === 0) {
        return <EmptyPlaceholder />;
    }

    if (loading) {
        return (
            <div className="my-20 flex w-full items-center justify-center">
                <Spinner size="xl" color="current" className="h-20 w-20" />
            </div>
        );
    }

    return (
        <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] sm:gap-4">
            {stocks.map(stock => (
                <StockCard key={stock.symbol} stock={stock} />
            ))}
        </main>
    );
});
