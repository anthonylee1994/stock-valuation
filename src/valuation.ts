import type {ValuationData, ValuationStock} from "@/types";
import {convertSheetRowToValuationStock, fetchValuationDataFromSheets} from "@/services/googleSheets";

export async function fetchValuationData(): Promise<ValuationData> {
    const {rows, warnings} = await fetchValuationDataFromSheets();
    const stocks: ValuationStock[] = rows.map(convertSheetRowToValuationStock);

    return {
        stocks,
        warnings,
    };
}
