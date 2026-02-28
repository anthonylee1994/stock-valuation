import type {ValuationData} from "@/types";
import {getUniqueSymbols, validateAndDeduplicateStocks} from "@/utils/stockHelpers";
import {valuationData} from "@/valuation";

// Timing constants
export const PULSE_DURATION = 1500; // ms - duration of pulse animation
export const POLLING_INTERVAL = 10_000; // ms - interval between API calls (10 seconds)

// Pre-compute deduplicated stocks at module load time
export const DEDUPED_STOCKS = validateAndDeduplicateStocks(valuationData.stocks);

// Pre-compute symbols string
export const SYMBOLS = getUniqueSymbols(DEDUPED_STOCKS);

// Re-export for convenience
export type {ValuationData};
