import type {ValuationMetricType} from "@/types";

interface SheetRow {
    symbol: string;
    name?: string;
    metricType: string;
    metricBase: number;
    lowMultiple: number;
    highMultiple: number;
    valuationLow: number;
    valuationHigh: number;
    currentPrice: number;
    potentialDownSide: number;
    potentialUpSide: number;
}

interface GoogleSheetsResponse {
    values: string[][];
}

interface GoogleSheetsBatchResponse {
    valueRanges: GoogleSheetsResponse[];
}

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
const SHEET_RANGES = ["美股!A2:K100", "港股!A2:K100"];
const DEFAULT_METRIC: ValuationMetricType = "P/E";

const parseNumber = (value?: string) => Number.parseFloat(value ?? "") || 0;

const mapSheetRow = (row: string[]): SheetRow => {
    const [symbol, name, metricType, metricBase, lowMultiple, highMultiple, valuationLow, valuationHigh, currentPrice, potentialDownSide, potentialUpSide] = row;

    return {
        symbol: symbol || "",
        name: name || undefined,
        metricType: metricType || DEFAULT_METRIC,
        metricBase: parseNumber(metricBase),
        lowMultiple: parseNumber(lowMultiple),
        highMultiple: parseNumber(highMultiple),
        valuationLow: parseNumber(valuationLow),
        valuationHigh: parseNumber(valuationHigh),
        currentPrice: parseNumber(currentPrice),
        potentialDownSide: parseNumber(potentialDownSide),
        potentialUpSide: parseNumber(potentialUpSide),
    };
};

const normalizeSymbol = (symbol: string) => (symbol.startsWith("HKG:") ? `${symbol.replace("HKG:", "")}.HK` : symbol);

export const fetchValuationDataFromSheets = async (): Promise<SheetRow[]> => {
    if (!API_KEY || !SPREADSHEET_ID) {
        throw new Error("Missing Google Sheets API credentials");
    }

    const query = SHEET_RANGES.map(range => `ranges=${encodeURIComponent(range)}`).join("&");
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${query}&key=${API_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Google Sheets API error: ${response.statusText}`);
        }

        const data: GoogleSheetsBatchResponse = await response.json();

        if (!data.valueRanges || data.valueRanges.length === 0) {
            return [];
        }

        return data.valueRanges.flatMap(valueRange => (valueRange.values ?? []).map(mapSheetRow));
    } catch (error) {
        console.error("Failed to fetch data from Google Sheets:", error);
        throw error;
    }
};

export const convertSheetRowToValuationStock = (row: SheetRow) => {
    return {
        symbol: normalizeSymbol(row.symbol),
        name: row.name,
        metric: row.metricType as ValuationMetricType,
        base: row.metricBase,
        lowMultiple: row.lowMultiple,
        highMultiple: row.highMultiple,
        valuationLow: row.valuationLow,
        valuationHigh: row.valuationHigh,
    };
};
