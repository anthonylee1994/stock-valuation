import {memo} from "react";
import {StockCard} from "./StockCard";
import type {StockWithQuote} from "../types";

interface Props {
    stocks: StockWithQuote[];
}

// 用 memo 避免 parent re-render 時跟住 re-render
export const StockGrid = memo(({stocks}: Props) => {
    return (
        <main className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 max-w-[1400px] mx-auto max-[640px]:grid-cols-1 max-[640px]:gap-4">
            {stocks.map(stock => (
                <StockCard key={stock.symbol} stock={stock} />
            ))}
        </main>
    );
});
