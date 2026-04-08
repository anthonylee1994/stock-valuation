import type {ValuationData, ValuationStock} from "@/types";
import {convertSheetRowToValuationStock, fetchValuationDataFromSheets} from "@/services/googleSheets";

export const fetchValuationData = async (): Promise<ValuationData> => {
    const sheetRows = await fetchValuationDataFromSheets();
    const stocks: ValuationStock[] = sheetRows.map(convertSheetRowToValuationStock);

    return {
        stocks,
    };
};
