import type {ValuationData, ValuationStock} from "@/types";

type ValuationMetricType = "P/E" | "P/S" | "P/B" | "P/OCF" | "Dividend Yield";

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
        metric: "P/E",
        base: 8.24,
        lowMultiple: 28,
        highMultiple: 38,
    },
    {
        symbol: "AMZN",
        metric: "P/OCF",
        base: 12.96,
        lowMultiple: 18,
        highMultiple: 25,
    },
    {
        symbol: "AVGO",
        metric: "P/E",
        base: 10.5,
        lowMultiple: 23,
        highMultiple: 38,
    },
    {
        symbol: "COIN",
        metric: "P/S",
        base: 26.81,
        lowMultiple: 6,
        highMultiple: 12,
    },
    {
        symbol: "CRM",
        metric: "P/S",
        base: 43,
        lowMultiple: 5,
        highMultiple: 8,
    },
    {
        symbol: "ETN",
        metric: "P/E",
        base: 13.36,
        lowMultiple: 20,
        highMultiple: 32,
    },
    {
        symbol: "GOOG",
        metric: "P/E",
        base: 12.85,
        lowMultiple: 20,
        highMultiple: 30,
    },
    {
        symbol: "HON",
        metric: "P/E",
        base: 10.42,
        lowMultiple: 17,
        highMultiple: 25,
    },
    {
        symbol: "HOOD",
        metric: "P/E",
        base: 3.15,
        lowMultiple: 25,
        highMultiple: 45,
    },
    {
        symbol: "JPM",
        metric: "P/E",
        base: 22.84,
        lowMultiple: 8,
        highMultiple: 15,
        remark: "ROTE 與 PTB 成正比 (7-8% ROTE ≈ 1x PTB, 22% ≈ 3x PTB)",
    },
    {
        symbol: "META",
        metric: "P/E",
        base: 29.54,
        lowMultiple: 18,
        highMultiple: 25,
    },
    {
        symbol: "MSFT",
        metric: "P/E",
        base: 20.15,
        lowMultiple: 25,
        highMultiple: 35,
    },
    {
        symbol: "NBIS",
        metric: "P/S",
        base: 13.24,
        lowMultiple: 6,
        highMultiple: 12,
    },
    {
        symbol: "NVDA",
        metric: "P/E",
        base: 10.5,
        lowMultiple: 25,
        highMultiple: 40,
    },
    {
        symbol: "TSM",
        metric: "P/E",
        base: 14.61,
        lowMultiple: 20,
        highMultiple: 30,
    },
    {
        symbol: "0175.HK",
        metric: "P/E",
        base: 1.9,
        lowMultiple: 7,
        highMultiple: 14,
    },
    {
        symbol: "0358.HK",
        metric: "P/B",
        base: 26,
        lowMultiple: 0.5,
        highMultiple: 1,
    },
    {
        symbol: "0388.HK",
        metric: "P/E",
        base: 13.4,
        lowMultiple: 25,
        highMultiple: 40,
    },
    {
        symbol: "0700.HK",
        metric: "P/E",
        base: 35.33,
        lowMultiple: 15,
        highMultiple: 25,
    },
    {
        symbol: "0883.HK",
        metric: "Dividend Yield",
        base: 1.23,
        lowMultiple: 0.05,
        highMultiple: 0.08,
    },
    {
        symbol: "1088.HK",
        metric: "Dividend Yield",
        base: 2.2,
        lowMultiple: 0.05,
        highMultiple: 0.08,
    },
    {
        symbol: "2899.HK",
        metric: "P/E",
        base: 2.78,
        lowMultiple: 13,
        highMultiple: 20,
    },
    {
        symbol: "2333.HK",
        metric: "P/E",
        base: 1.65,
        lowMultiple: 7,
        highMultiple: 14,
    },
    {
        symbol: "3750.HK",
        metric: "P/E",
        base: 22.7,
        lowMultiple: 18,
        highMultiple: 28,
    },
    {
        symbol: "9868.HK",
        metric: "P/S",
        base: 67.4,
        lowMultiple: 1,
        highMultiple: 1.5,
    },
];

const computeValuationFromBase = (config: BaseValuationConfig): ValuationStock => {
    const {symbol, base, lowMultiple, highMultiple, metric} = config;

    let valuationLow: number;
    let valuationHigh: number;

    if (metric === "Dividend Yield") {
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
