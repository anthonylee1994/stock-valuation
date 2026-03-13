import type {ValuationData, ValuationStock} from "@/types";

type ValuationMetricType = "P/E" | "P/S" | "P/OCF" | "DIVIDEND_YIELD" | "P/B";

interface BaseValuationConfig {
    symbol: string;
    base: number;
    lowMultiple: number;
    highMultiple: number;
    metric: ValuationMetricType;
    remark?: string;
}

const baseValuationConfigs: BaseValuationConfig[] = [
    {
        symbol: "AAPL",
        base: 8.24,
        lowMultiple: 28,
        highMultiple: 38,
        metric: "P/E",
    },
    {
        symbol: "AMZN",
        base: 12.96,
        lowMultiple: 18,
        highMultiple: 25,
        metric: "P/OCF",
    },
    {
        symbol: "AVGO",
        base: 10.5,
        lowMultiple: 23,
        highMultiple: 38,
        metric: "P/E",
    },
    {
        symbol: "COIN",
        base: 26.81,
        lowMultiple: 6,
        highMultiple: 12,
        metric: "P/S",
    },
    {
        symbol: "CRM",
        base: 43,
        lowMultiple: 5,
        highMultiple: 8,
        metric: "P/S",
    },
    {
        symbol: "ETN",
        base: 13.36,
        lowMultiple: 20,
        highMultiple: 32,
        metric: "P/E",
    },
    {
        symbol: "GOOG",
        base: 12.85,
        lowMultiple: 20,
        highMultiple: 30,
        metric: "P/E",
    },
    {
        symbol: "HON",
        base: 10.42,
        lowMultiple: 17,
        highMultiple: 25,
        metric: "P/E",
    },
    {
        symbol: "HOOD",
        base: 3.15,
        lowMultiple: 25,
        highMultiple: 45,
        metric: "P/E",
    },
    {
        symbol: "JPM",
        base: 22.84,
        lowMultiple: 8,
        highMultiple: 15,
        metric: "P/E",
        remark: "ROTE 與 PTB 成正比 (7-8% ROTE ≈ 1x PTB, 22% ≈ 3x PTB)",
    },
    {
        symbol: "META",
        base: 29.54,
        lowMultiple: 18,
        highMultiple: 25,
        metric: "P/E",
    },
    {
        symbol: "MSFT",
        base: 20.15,
        lowMultiple: 25,
        highMultiple: 35,
        metric: "P/E",
    },
    {
        symbol: "NBIS",
        base: 13.24,
        lowMultiple: 6,
        highMultiple: 12,
        metric: "P/S",
    },
    {
        symbol: "NVDA",
        base: 10.5,
        lowMultiple: 25,
        highMultiple: 40,
        metric: "P/E",
    },
    {
        symbol: "TSM",
        base: 14.61,
        lowMultiple: 20,
        highMultiple: 30,
        metric: "P/E",
    },
    {
        symbol: "0388.HK",
        base: 13.4,
        lowMultiple: 25,
        highMultiple: 40,
        metric: "P/E",
    },
    {
        symbol: "0700.HK",
        base: 35.33,
        lowMultiple: 15,
        highMultiple: 25,
        metric: "P/E",
    },
    {
        symbol: "2899.HK",
        base: 2.78,
        lowMultiple: 13,
        highMultiple: 20,
        metric: "P/E",
    },
    {
        symbol: "0883.HK",
        base: 1.23,
        lowMultiple: 0.05,
        highMultiple: 0.08,
        metric: "DIVIDEND_YIELD",
    },
    {
        symbol: "1088.HK",
        base: 2.2,
        lowMultiple: 0.05,
        highMultiple: 0.08,
        metric: "DIVIDEND_YIELD",
    },
    {
        symbol: "0358.HK",
        base: 26,
        lowMultiple: 0.5,
        highMultiple: 1,
        metric: "P/B",
    },
    {
        symbol: "2333.HK",
        base: 1.65,
        lowMultiple: 7,
        highMultiple: 14,
        metric: "P/E",
    },
    {
        symbol: "9868.HK",
        base: 67.4,
        lowMultiple: 1,
        highMultiple: 1.5,
        metric: "P/S",
    },
    {
        symbol: "0175.HK",
        base: 1.9,
        lowMultiple: 7,
        highMultiple: 14,
        metric: "P/E",
    },
    {
        symbol: "3750.HK",
        base: 22.7,
        lowMultiple: 18,
        highMultiple: 28,
        metric: "P/E",
    },
];

const computeValuationFromBase = (config: BaseValuationConfig): ValuationStock => {
    const {symbol, base, lowMultiple, highMultiple, metric} = config;

    let valuationLow: number;
    let valuationHigh: number;

    if (metric === "DIVIDEND_YIELD") {
        // For yields, price = dividend / yield. Lower yield => higher price.
        valuationLow = base / highMultiple;
        valuationHigh = base / lowMultiple;
    } else {
        valuationLow = base * lowMultiple;
        valuationHigh = base * highMultiple;
    }

    return {
        symbol,
        valuationLow: Number(valuationLow.toFixed(2)),
        valuationHigh: Number(valuationHigh.toFixed(2)),
    };
};

export const valuationData: ValuationData = {
    stocks: baseValuationConfigs.map(computeValuationFromBase),
};
