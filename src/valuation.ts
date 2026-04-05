import type {ValuationData, ValuationStock} from "@/types";
import {convertSheetRowToValuationStock, fetchValuationDataFromSheets} from "@/services/googleSheets";

// Fetch valuation data from Google Sheets
export const fetchValuationData = async (): Promise<ValuationData> => {
    try {
        const sheetRows = await fetchValuationDataFromSheets();
        const stocks: ValuationStock[] = sheetRows.map(convertSheetRowToValuationStock);

        return {
            stocks,
        };
    } catch (error) {
        console.error("Failed to fetch valuation data:", error);
        // Return empty data on error
        return {
            stocks: [],
        };
    }
};
