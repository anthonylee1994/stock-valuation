import type {ValuationData, ValuationStock} from "@/types";
import {convertSheetRowToValuationStock, fetchValuationDataFromSheets} from "@/services/googleSheets";

export const fetchValuationData = async (): Promise<ValuationData> => {
    const {rows, warnings} = await fetchValuationDataFromSheets();
    const stocks: ValuationStock[] = rows.map(convertSheetRowToValuationStock);

    return {
        stocks,
        warnings,
    };
};
