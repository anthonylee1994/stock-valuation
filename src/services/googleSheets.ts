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
    potentialDownside: number;
    potentialUpside: number;
}

interface GoogleSheetsResponse {
    range?: string;
    values: string[][];
}

interface GoogleSheetsBatchResponse {
    valueRanges: GoogleSheetsResponse[];
}

interface ParsedSheetRow {
    row: SheetRow | null;
    error: string | null;
}

export interface FetchValuationRowsResult {
    rows: SheetRow[];
    warnings: string[];
}

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
const SHEET_RANGES = ["美股!A2:K100", "港股!A2:K100"];
const DEFAULT_METRIC: ValuationMetricType = "P/E";
const ALLOWED_METRICS = new Set<ValuationMetricType>(["P/E", "P/S", "P/B", "P/OCF", "股息率"]);

const parseNumber = (value?: string) => Number.parseFloat(value ?? "") || 0;

const parsePositiveNumber = (value: string | undefined, label: string, rowNumber: number, sheetName: string): number => {
    const parsed = Number.parseFloat(value ?? "");

    if (!Number.isFinite(parsed)) {
        throw new Error(formatRowError(sheetName, rowNumber, `欄位「${label}」不是有效數字`));
    }

    return parsed;
};

const getRangeContext = (range?: string) => {
    const match = range?.match(/^'?([^'!]+)'?![A-Z]+(\d+):/);

    return {
        sheetName: match?.[1] ?? "工作表",
        startRow: match?.[2] ? Number.parseInt(match[2], 10) : 2,
    };
};

const formatRowError = (sheetName: string, rowNumber: number, message: string) => `${sheetName} 第 ${rowNumber} 行${message}`;

const mapSheetRow = (row: string[], rowNumber: number, sheetName: string): ParsedSheetRow => {
    const [symbol, name, metricType, metricBase, lowMultiple, highMultiple, valuationLow, valuationHigh, , potentialDownside, potentialUpside] = row;

    try {
        const normalizedSymbol = symbol?.trim();
        if (!normalizedSymbol) {
            throw new Error(formatRowError(sheetName, rowNumber, "缺少股票代號"));
        }

        const normalizedMetricType = metricType?.trim() || DEFAULT_METRIC;
        if (!ALLOWED_METRICS.has(normalizedMetricType as ValuationMetricType)) {
            throw new Error(formatRowError(sheetName, rowNumber, `欄位「metricType」不受支援: ${normalizedMetricType}`));
        }

        const parsedRow: SheetRow = {
            symbol: normalizedSymbol,
            name: name?.trim() || undefined,
            metricType: normalizedMetricType,
            metricBase: parsePositiveNumber(metricBase, "metricBase", rowNumber, sheetName),
            lowMultiple: parsePositiveNumber(lowMultiple, "lowMultiple", rowNumber, sheetName),
            highMultiple: parsePositiveNumber(highMultiple, "highMultiple", rowNumber, sheetName),
            valuationLow: parsePositiveNumber(valuationLow, "valuationLow", rowNumber, sheetName),
            valuationHigh: parsePositiveNumber(valuationHigh, "valuationHigh", rowNumber, sheetName),
            potentialDownside: parseNumber(potentialDownside),
            potentialUpside: parseNumber(potentialUpside),
        };

        if (parsedRow.valuationLow > parsedRow.valuationHigh) {
            throw new Error(formatRowError(sheetName, rowNumber, "估值下限高於上限"));
        }

        return {row: parsedRow, error: null};
    } catch (error) {
        return {
            row: null,
            error: error instanceof Error ? error.message : formatRowError(sheetName, rowNumber, "資料格式錯誤"),
        };
    }
};

function normalizeSymbol(symbol: string) {
    return symbol.startsWith("HKG:") ? `${symbol.replace("HKG:", "")}.HK` : symbol;
}

export async function fetchValuationDataFromSheets(): Promise<FetchValuationRowsResult> {
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
            return {rows: [], warnings: []};
        }

        const warnings: string[] = [];
        const rows = data.valueRanges.flatMap(valueRange => {
            const {sheetName, startRow} = getRangeContext(valueRange.range);

            return (valueRange.values ?? []).flatMap((row, index) => {
                const parsed = mapSheetRow(row, startRow + index, sheetName);

                if (parsed.error) {
                    warnings.push(parsed.error);
                    return [];
                }

                return parsed.row ? [parsed.row] : [];
            });
        });

        if (rows.length === 0 && warnings.length > 0) {
            throw new Error(`Google Sheets 資料無法使用：${warnings[0]}`);
        }

        return {rows, warnings};
    } catch (error) {
        console.error("Failed to fetch data from Google Sheets:", error);
        throw error;
    }
}

export function convertSheetRowToValuationStock(row: SheetRow) {
    return {
        symbol: normalizeSymbol(row.symbol),
        name: row.name,
        metric: row.metricType as ValuationMetricType,
        base: row.metricBase,
        lowMultiple: row.lowMultiple,
        highMultiple: row.highMultiple,
        valuationLow: row.valuationLow,
        valuationHigh: row.valuationHigh,
        potentialDownside: row.potentialDownside,
        potentialUpside: row.potentialUpside,
    };
}
