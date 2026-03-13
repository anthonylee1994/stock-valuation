import type {StockWithQuote} from "@/types";
import {getActivePrice, getStatus} from "@/utils/stockHelpers";
import {Card} from "@heroui/react";
import React from "react";
import {CardHeader} from "./CardHeader";
import {CompactValuationBar} from "./CompactValuationBar";
import {STATUS_CONFIG} from "./constants";
import {PriceDisplay} from "./PriceDisplay";
import {ValuationMetrics} from "./ValuationMetrics";

interface Props {
    stock: StockWithQuote;
}

/**
 * 精確的 memo 比較函數，確保所有關鍵指標變化時都能重新渲染
 */
const areEqual = (prev: Props, next: Props) => {
    const p = prev.stock;
    const n = next.stock;

    return (
        // 基本信息
        p.symbol === n.symbol &&
        // 當前市場價格數據
        p.currentPrice === n.currentPrice &&
        p.change === n.change &&
        p.percentChange === n.percentChange &&
        // 盤前/盤後數據
        p.preMarketPrice === n.preMarketPrice &&
        p.preMarketChange === n.preMarketChange &&
        p.postMarketPrice === n.postMarketPrice &&
        p.postMarketChange === n.postMarketChange &&
        // 估值與財務指標
        p.valuationLow === n.valuationLow &&
        p.valuationHigh === n.valuationHigh &&
        p.forwardPE === n.forwardPE &&
        p.priceToBook === n.priceToBook &&
        p.dividendYield === n.dividendYield
    );
};

export const StockCard = React.memo<Props>(({stock}: Props) => {
    const {price, change, percentChange} = getActivePrice(stock);
    const {symbol, name, valuationLow, valuationHigh, metric, base, lowMultiple, highMultiple, forwardPE, priceToBook, dividendYield} = stock;

    const status = getStatus(price, valuationLow, valuationHigh);
    const statusConfig = STATUS_CONFIG[status];

    return (
        <Card role="article" aria-labelledby={`card-title-${symbol}`} className={`p-5 bg-surface border-2 select-none shadow-sm rounded-2xl transition-all ${statusConfig.borderClass}`}>
            <CardHeader symbol={symbol} name={name} status={status} />
            <PriceDisplay price={price} change={change} percentChange={percentChange} />
            <ValuationMetrics
                valuationLow={valuationLow}
                valuationHigh={valuationHigh}
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
}, areEqual);
