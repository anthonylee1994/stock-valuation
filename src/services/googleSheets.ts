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
    range: string;
    majorDimension: string;
    values: string[][];
}

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;

export const fetchValuationDataFromSheets = async (): Promise<SheetRow[]> => {
    if (!API_KEY || !SPREADSHEET_ID) {
        throw new Error("Missing Google Sheets API credentials");
    }

    // Fetch both US and HK stocks
    const ranges = ["美股!A2:K100", "港股!A2:K100"];
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${ranges.map(r => `ranges=${encodeURIComponent(r)}`).join("&")}&key=${API_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Google Sheets API error: ${response.statusText}`);
        }

        const data: {valueRanges: GoogleSheetsResponse[]} = await response.json();

        if (!data.valueRanges || data.valueRanges.length === 0) {
            return [];
        }

        // Combine all rows from both sheets
        const allRows: SheetRow[] = [];

        data.valueRanges.forEach((valueRange) => {
            if (!valueRange.values || valueRange.values.length === 0) {
                return;
            }

            const rows = valueRange.values.map((row) => {
                const [
                    symbol,
                    name,
                    metricType,
                    metricBase,
                    lowMultiple,
                    highMultiple,
                    valuationLow,
                    valuationHigh,
                    currentPrice,
                    potentialDownSide,
                    potentialUpSide,
                ] = row;

                return {
                    symbol: symbol || "",
                    name: name || undefined,
                    metricType: metricType || "P/E",
                    metricBase: parseFloat(metricBase) || 0,
                    lowMultiple: parseFloat(lowMultiple) || 0,
                    highMultiple: parseFloat(highMultiple) || 0,
                    valuationLow: parseFloat(valuationLow) || 0,
                    valuationHigh: parseFloat(valuationHigh) || 0,
                    currentPrice: parseFloat(currentPrice) || 0,
                    potentialDownSide: parseFloat(potentialDownSide) || 0,
                    potentialUpSide: parseFloat(potentialUpSide) || 0,
                };
            });

            allRows.push(...rows);
        });

        return allRows;
    } catch (error) {
        console.error("Failed to fetch data from Google Sheets:", error);
        throw error;
    }
};

export const convertSheetRowToValuationStock = (row: SheetRow) => {
    // Convert HKG:XXXX format to XXXX.HK format for Hong Kong stocks
    let symbol = row.symbol;
    if (symbol.startsWith("HKG:")) {
        symbol = symbol.replace("HKG:", "") + ".HK";
    }

    return {
        symbol,
        name: row.name,
        metric: row.metricType as ValuationMetricType,
        base: row.metricBase,
        lowMultiple: row.lowMultiple,
        highMultiple: row.highMultiple,
        valuationLow: row.valuationLow,
        valuationHigh: row.valuationHigh,
    };
};
