import React from "react";
import {Card, Chip} from "@heroui/react";
import type {StockWithQuote} from "../../types";
import {STATUS_CONFIG, getStatus, calculatePotential} from "./constants";
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
        <Card role="article" aria-labelledby={`card-title-${symbol}`} className={`bg-surface transition-all duration-100 border-3 select-none ${config.borderClass}`}>
            <Card.Header className="flex flex-row items-center justify-between">
                <Card.Title id={`card-title-${symbol}`} className="m-0 text-2xl font-bold tracking-wide max-[480px]:text-xl">
                    {symbol}
                </Card.Title>
                <Chip color={config.color} variant="soft" size="md">
                    <config.icon className="mr-1" aria-hidden />
                    {config.label}
                </Chip>
            </Card.Header>

            <Card.Content>
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <PriceCard name={name} price={price} change={change} percentChange={percentChange} forwardPE={forwardPE} priceToBook={priceToBook} dividendYield={dividendYield} />
                    <ValuationRangeDisplay valuationLow={valuationLow} valuationHigh={valuationHigh} />
                </div>

                <ValuationBar price={price} valuationLow={valuationLow} valuationHigh={valuationHigh} />

                <PotentialDisplay potentialDownside={potentialDownside} potentialUpside={potentialUpside} />
            </Card.Content>
        </Card>
    );
});
