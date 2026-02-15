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

export const StockCard = ({stock}: Props) => {
    const {price, change, percentChange} = getActivePrice(stock);
    const {symbol, name, currentPrice, valuationLow, valuationHigh, forwardPE, priceToBook, dividendYield} = stock;

    const status = getStatus(price, valuationLow, valuationHigh);
    const config = STATUS_CONFIG[status];

    const potentialDownside = calculatePotential(price, valuationLow);
    const potentialUpside = calculatePotential(price, valuationHigh);

    return (
        <Card className={`bg-gradient-to-br from-slate-800 to-slate-950 border-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-500 ${config.borderClass}`}>
            <Card.Header className="flex flex-row items-center justify-between">
                <h2 className="m-0 text-2xl font-bold text-slate-100 tracking-wide max-[480px]:text-xl">{symbol}</h2>
                <Chip color={config.color} variant="soft" size="sm">
                    {config.emoji} {config.label}
                </Chip>
            </Card.Header>

            <Card.Content>
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <PriceCard name={name} price={price} change={change} percentChange={percentChange} forwardPE={forwardPE} priceToBook={priceToBook} dividendYield={dividendYield} />
                    <ValuationRangeDisplay valuationLow={valuationLow} valuationHigh={valuationHigh} />
                </div>

                <ValuationBar currentPrice={currentPrice} price={price} valuationLow={valuationLow} valuationHigh={valuationHigh} />

                <PotentialDisplay potentialDownside={potentialDownside} potentialUpside={potentialUpside} />
            </Card.Content>
        </Card>
    );
};
