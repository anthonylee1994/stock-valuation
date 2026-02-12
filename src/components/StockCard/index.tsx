import {Card, Chip} from "@heroui/react";
import type {StockWithQuote} from "../../types";
import {STATUS_CONFIG, getStatus} from "./constants";
import {PriceCard} from "./PriceCard";
import {ValuationRangeDisplay} from "./ValuationRangeDisplay";
import {ValuationBar} from "./ValuationBar";
import {PotentialDisplay} from "./PotentialDisplay";

interface Props {
    stock: StockWithQuote;
}

export const StockCard = ({stock}: Props) => {
    const {
        symbol,
        currentPrice,
        preMarketPrice,
        change: currentChange,
        percentChange: currentPercentChange,
        preMarketChange,
        preMarketChangePercent,
        postMarketChange,
        postMarketChangePercent,
        postMarketPrice,
        valuationLow,
        valuationHigh,
        forwardPE,
        priceToBook,
        dividendYield,
    } = stock;

    const price = typeof preMarketPrice !== "undefined" ? preMarketPrice : typeof postMarketPrice !== "undefined" ? postMarketPrice : currentPrice;
    const change = typeof preMarketChange !== "undefined" ? preMarketChange : typeof postMarketChange !== "undefined" ? postMarketChange : currentChange;
    const percentChange = typeof preMarketChangePercent !== "undefined" ? preMarketChangePercent : typeof postMarketChangePercent !== "undefined" ? postMarketChangePercent : currentPercentChange;

    const status = getStatus(price, valuationLow, valuationHigh);
    const config = STATUS_CONFIG[status];

    const potentialDownside = price > 0 ? -1 * ((price - valuationLow) / price) * 100 : 0;
    const potentialUpside = price > 0 ? ((valuationHigh - price) / price) * 100 : 0;

    const borderClass = status === "undervalued" ? "border-green-500 shadow-green-500/15" : status === "overvalued" ? "border-red-500 shadow-red-500/15" : "border-yellow-500 shadow-yellow-500/15";

    return (
        <Card className={`bg-gradient-to-br from-slate-800 to-slate-950 border-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-500 ${borderClass}`}>
            <Card.Header className="flex flex-row items-center justify-between">
                <h2 className="m-0 text-2xl font-bold text-slate-100 tracking-wide max-[480px]:text-xl">{symbol}</h2>
                <Chip color={config.color} variant="soft" size="sm">
                    {config.emoji} {config.label}
                </Chip>
            </Card.Header>

            <Card.Content>
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <PriceCard price={price} change={change} percentChange={percentChange} forwardPE={forwardPE} priceToBook={priceToBook} dividendYield={dividendYield} />
                    <ValuationRangeDisplay valuationLow={valuationLow} valuationHigh={valuationHigh} />
                </div>

                <ValuationBar currentPrice={currentPrice} price={price} valuationLow={valuationLow} valuationHigh={valuationHigh} />

                <PotentialDisplay potentialDownside={potentialDownside} potentialUpside={potentialUpside} />
            </Card.Content>
        </Card>
    );
};
