import type {StockWithQuote, ValuationStatus} from "../types";
import "./index.css";

const STATUS_CONFIG: Record<ValuationStatus, {emoji: string; label: string; borderClass: string}> = {
    undervalued: {emoji: "🟢", label: "低估", borderClass: "status-undervalued"},
    fair: {emoji: "🟡", label: "合理", borderClass: "status-fair"},
    overvalued: {emoji: "🔴", label: "高估", borderClass: "status-overvalued"},
};

function getStatus(currentPrice: number, low: number, high: number): ValuationStatus {
    if (currentPrice < low) return "undervalued";
    if (currentPrice > high) return "overvalued";
    return "fair";
}

function formatPrice(value: number): string {
    return "$" + value.toFixed(2);
}

function formatPercent(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return sign + value.toFixed(2) + "%";
}

interface StockCardProps {
    stock: StockWithQuote;
}

export function StockCard({stock}: StockCardProps) {
    const {symbol, currentPrice, valuationLow, valuationHigh} = stock;
    const status = getStatus(currentPrice, valuationLow, valuationHigh);
    const config = STATUS_CONFIG[status];

    const barMin = Math.min(valuationLow, currentPrice) * 0.9;
    const barMax = Math.max(valuationHigh, currentPrice) * 1.1;
    const barRange = barMax - barMin;
    const markerPosition = barRange > 0 ? ((currentPrice - barMin) / barRange) * 100 : 50;
    const lowPosition = barRange > 0 ? ((valuationLow - barMin) / barRange) * 100 : 0;
    const highPosition = barRange > 0 ? ((valuationHigh - barMin) / barRange) * 100 : 100;

    const pctFromLow = valuationLow > 0 ? ((currentPrice - valuationLow) / valuationLow) * 100 : 0;
    const pctFromHigh = valuationHigh > 0 ? ((currentPrice - valuationHigh) / valuationHigh) * 100 : 0;

    return (
        <article className={`stock-card ${config.borderClass}`}>
            <header className="stock-card-header">
                <h2 className="stock-symbol">{symbol}</h2>
                <span className="stock-status">
                    {config.emoji} {config.label}
                </span>
            </header>

            <div className="stock-prices">
                <div className="price-box">
                    <span className="price-label">現價</span>
                    <span className="price-value">{formatPrice(currentPrice)}</span>
                </div>
                <div className="price-box">
                    <span className="price-label">估值下限</span>
                    <span className="price-value">{formatPrice(valuationLow)}</span>
                </div>
                <div className="price-box">
                    <span className="price-label">估值上限</span>
                    <span className="price-value">{formatPrice(valuationHigh)}</span>
                </div>
            </div>

            <div className="bar-chart-wrap">
                <div
                    className="bar-chart-track"
                    style={{
                        background: `linear-gradient(to right,
                            #22c55e 0%,
                            #22c55e ${lowPosition}%,
                            #eab308 ${lowPosition}%,
                            #eab308 ${highPosition}%,
                            #ef4444 ${highPosition}%,
                            #ef4444 100%)`,
                    }}
                />
                <div className="bar-chart-marker" style={{left: `${markerPosition}%`}} title={formatPrice(currentPrice)} />
                <div className="bar-chart-marker-label" style={{left: `${markerPosition}%`}}>
                    <span className="marker-arrow">▼</span>
                    <span className="marker-price">{formatPrice(currentPrice)}</span>
                </div>
            </div>

            <div className="stock-meta">
                <span className="pct-from-low">距估值下限 {formatPercent(pctFromLow)}</span>
                <span className="pct-from-high">距估值上限 {formatPercent(pctFromHigh)}</span>
            </div>
        </article>
    );
}
