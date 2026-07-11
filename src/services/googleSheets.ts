import type {Sector, ValuationMetricType} from "@/types";

interface SheetRow {
    symbol: string;
    name?: string;
    metricType: ValuationMetricType;
    sector: Sector;
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
const METRIC_SHEET_NAME = "估值模型";
const SECTOR_SHEET_NAME = "板塊";
const CONFIG_SHEET_NAMES = new Set([METRIC_SHEET_NAME, SECTOR_SHEET_NAME]);
const SHEET_RANGES = [`${METRIC_SHEET_NAME}!A2:A100`, `${SECTOR_SHEET_NAME}!A2:A100`, "美股!A2:L100", "港股!A2:L100"];
const DEFAULT_METRIC: ValuationMetricType = "P/E";
const DEFAULT_SECTOR: Sector = "科技";

function parseNumber(value?: string) {
    return Number.parseFloat(value ?? "") || 0;
}

function parsePositiveNumber(value: string | undefined, label: string, rowNumber: number, sheetName: string): number {
    const parsed = Number.parseFloat(value ?? "");

    if (!Number.isFinite(parsed)) {
        throw new Error(formatRowError(sheetName, rowNumber, `欄位「${label}」不是有效數字`));
    }

    return parsed;
}

function getRangeContext(range?: string) {
    const match = range?.match(/^'?([^'!]+)'?![A-Z]+(\d+):/);

    return {
        sheetName: match?.[1] ?? "工作表",
        startRow: match?.[2] ? Number.parseInt(match[2], 10) : 2,
    };
}

function formatRowError(sheetName: string, rowNumber: number, message: string) {
    return `${sheetName} 第 ${rowNumber} 行${message}`;
}

function getAllowedValues(valueRanges: GoogleSheetsResponse[], sheetName: string) {
    const valueRange = valueRanges.find(range => getRangeContext(range.range).sheetName === sheetName);

    return new Set((valueRange?.values ?? []).map(row => row[0]?.trim()).filter((value): value is string => Boolean(value)));
}

function mapSheetRow(row: string[], rowNumber: number, sheetName: string, allowedMetrics: Set<string>, allowedSectors: Set<string>): ParsedSheetRow {
    const [symbol, name, metricType, metricBase, lowMultiple, highMultiple, valuationLow, valuationHigh, , potentialDownside, potentialUpside, sector] = row;

    try {
        const normalizedSymbol = symbol?.trim();
        if (!normalizedSymbol) {
            throw new Error(formatRowError(sheetName, rowNumber, "缺少股票代號"));
        }

        const normalizedMetricType = metricType?.trim() || DEFAULT_METRIC;
        if (!allowedMetrics.has(normalizedMetricType)) {
            throw new Error(formatRowError(sheetName, rowNumber, `欄位「metricType」不受支援: ${normalizedMetricType}`));
        }

        const normalizedSector = sector?.trim() || DEFAULT_SECTOR;
        if (!allowedSectors.has(normalizedSector)) {
            throw new Error(formatRowError(sheetName, rowNumber, `欄位「sector」不受支援: ${normalizedSector}`));
        }

        const parsedRow: SheetRow = {
            symbol: normalizedSymbol,
            name: name?.trim() || undefined,
            metricType: normalizedMetricType,
            sector: normalizedSector,
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
}

function normalizeSymbol(symbol: string) {
    if (symbol.startsWith("HKG:")) {
        return `${symbol.replace("HKG:", "")}.HK`;
    }
    if (symbol.includes(".")) {
        return symbol.replace(".", "-");
    }
    return symbol;
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

        const allowedMetrics = getAllowedValues(data.valueRanges, METRIC_SHEET_NAME);
        const allowedSectors = getAllowedValues(data.valueRanges, SECTOR_SHEET_NAME);

        if (allowedMetrics.size === 0) {
            throw new Error(`${METRIC_SHEET_NAME}工作表沒有可用嘅 Metric Type`);
        }
        if (allowedSectors.size === 0) {
            throw new Error(`${SECTOR_SHEET_NAME}工作表沒有可用嘅板塊`);
        }

        const warnings: string[] = [];
        const rows = data.valueRanges.flatMap(valueRange => {
            const {sheetName, startRow} = getRangeContext(valueRange.range);
            if (CONFIG_SHEET_NAMES.has(sheetName)) {
                return [];
            }

            return (valueRange.values ?? []).flatMap((row, index) => {
                const parsed = mapSheetRow(row, startRow + index, sheetName, allowedMetrics, allowedSectors);

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
        metric: row.metricType,
        sector: row.sector,
        base: row.metricBase,
        lowMultiple: row.lowMultiple,
        highMultiple: row.highMultiple,
        valuationLow: row.valuationLow,
        valuationHigh: row.valuationHigh,
        potentialDownside: row.potentialDownside,
        potentialUpside: row.potentialUpside,
    };
}
