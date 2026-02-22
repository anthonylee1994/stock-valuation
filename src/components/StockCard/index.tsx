import React from "react";
import {Card} from "@heroui/react";
import type {StockWithQuote} from "../../types";
import {STATUS_CONFIG, getStatus, calculatePotential} from "./constants";
import {CardHeader} from "./CardHeader";
import {PriceCard} from "./PriceCard";
import {ValuationRangeDisplay} from "./ValuationRangeDisplay";
import {ValuationBar} from "./ValuationBar";
import {PotentialDisplay} from "./PotentialDisplay";

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
    const config = STATUS_CONFIG[status];

    const potentialDownside = calculatePotential(price, valuationLow);
    const potentialUpside = calculatePotential(price, valuationHigh);

    return (
        <Card role="article" aria-labelledby={`card-title-${symbol}`} className={`p-0 bg-surface border-3 select-none shadow-sm rounded-3xl overflow-hidden ${config.borderClass}`}>
            <CardHeader symbol={symbol} name={name} price={price} valuationLow={valuationLow} valuationHigh={valuationHigh} />

            <Card.Content className="px-5 pb-0">
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <PriceCard name={name} price={price} change={change} percentChange={percentChange} forwardPE={forwardPE} priceToBook={priceToBook} dividendYield={dividendYield} />
                    <ValuationRangeDisplay valuationLow={valuationLow} valuationHigh={valuationHigh} />
                </div>
                <PotentialDisplay potentialDownside={potentialDownside} potentialUpside={potentialUpside} />

                <ValuationBar price={price} valuationLow={valuationLow} valuationHigh={valuationHigh} />
            </Card.Content>
        </Card>
    );
});
