import {StockCard} from "./StockCard";
import type {StockWithQuote} from "../types";

interface Props {
    stocks: StockWithQuote[];
}

export const StockGrid = ({stocks}: Props) => {
    return (
        <main className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 max-w-[1400px] mx-auto max-[640px]:grid-cols-1 max-[640px]:gap-4">
            {stocks.map((stock, index) => (
                <StockCard key={index} stock={stock} />
            ))}
        </main>
    );
};
