import type {StockWithQuote} from "@/types";
import {getActivePrice, getStatus} from "@/utils/stockHelpers";
import {Card} from "@heroui/react";
import React from "react";
import {CardHeader} from "./CardHeader";
import {CompactValuationBar} from "./CompactValuationBar";
import {areStockCardPropsEqual} from "./comparator";
import {STATUS_CONFIG} from "./constants";
import {PriceDisplay} from "./PriceDisplay";
import {ValuationMetrics} from "./ValuationMetrics";

interface Props {
    stock: StockWithQuote;
}

export const StockCard = React.memo<Props>(({stock}: Props) => {
    const {price, change, percentChange} = getActivePrice(stock);
    const {symbol, name, valuationLow, valuationHigh, potentialDownside, potentialUpside, metric, base, lowMultiple, highMultiple, forwardPE, priceToBook, dividendYield} = stock;

    const status = getStatus(price, valuationLow, valuationHigh);
    const statusConfig = STATUS_CONFIG[status];

    return (
        <Card role="article" aria-labelledby={`card-title-${symbol}`} className={`p-5 bg-surface border-[3px] select-none shadow-sm rounded-2xl transition-all ${statusConfig.borderClass}`}>
            <CardHeader symbol={symbol} name={name} status={status} />
            <PriceDisplay price={price} change={change} percentChange={percentChange} />
            <ValuationMetrics
                valuationLow={valuationLow}
                valuationHigh={valuationHigh}
                potentialDownside={potentialDownside}
                potentialUpside={potentialUpside}
                metric={metric}
                base={base}
                lowMultiple={lowMultiple}
                highMultiple={highMultiple}
                forwardPE={forwardPE}
                priceToBook={priceToBook}
                dividendYield={dividendYield}
                price={price}
            />
            <CompactValuationBar price={price} valuationLow={valuationLow} valuationHigh={valuationHigh} />
        </Card>
    );
}, areStockCardPropsEqual);
