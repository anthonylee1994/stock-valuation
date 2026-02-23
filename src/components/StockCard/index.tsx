import React from "react";
import {Card} from "@heroui/react";
import type {StockWithQuote} from "@/types";
import {getStatus} from "./constants";
import {CardHeader} from "./CardHeader";
import {PriceDisplay} from "./PriceDisplay";
import {ValuationMetrics} from "./ValuationMetrics";
import {CompactValuationBar} from "./CompactValuationBar";

interface Props {
    stock: StockWithQuote;
}

const getActivePrice = (stock: StockWithQuote) => ({
    price: stock.preMarketPrice ?? stock.postMarketPrice ?? stock.currentPrice,
    change: stock.preMarketChange ?? stock.postMarketChange ?? stock.change,
    percentChange: stock.preMarketChangePercent ?? stock.postMarketChangePercent ?? stock.percentChange,
});

export const StockCard = React.memo<Props>(({stock}: Props) => {
    const {price, change, percentChange} = getActivePrice(stock);
    const {symbol, name, valuationLow, valuationHigh, forwardPE, priceToBook, dividendYield} = stock;

    const status = getStatus(price, valuationLow, valuationHigh);

    return (
        <Card
            role="article"
            aria-labelledby={`card-title-${symbol}`}
            className={`p-5 bg-surface border-2 select-none shadow-sm rounded-2xl transition-all ${
                status === "undervalued" ? "border-success/50" : status === "overvalued" ? "border-danger/50" : "border-warning/50"
            }`}
        >
            <CardHeader symbol={symbol} name={name} price={price} valuationLow={valuationLow} valuationHigh={valuationHigh} />
            <PriceDisplay price={price} change={change} percentChange={percentChange} />
            <ValuationMetrics valuationLow={valuationLow} valuationHigh={valuationHigh} forwardPE={forwardPE} priceToBook={priceToBook} dividendYield={dividendYield} price={price} />
            <CompactValuationBar price={price} valuationLow={valuationLow} valuationHigh={valuationHigh} />
        </Card>
    );
});
