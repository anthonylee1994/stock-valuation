import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

describe("fetchValuationDataFromSheets", () => {
    beforeEach(() => {
        vi.resetModules();
        vi.unstubAllGlobals();
        import.meta.env.VITE_GOOGLE_SHEETS_API_KEY = "test-key";
        import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID = "test-sheet";
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("returns valid rows and warnings for invalid rows", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    valueRanges: [
                        {
                            range: "美股!A2:K100",
                            values: [
                                ["AAPL", "Apple", "P/E", "10", "12", "18", "150", "180"],
                                ["", "Broken", "P/E", "10", "12", "18", "150", "180"],
                            ],
                        },
                    ],
                }),
            })
        );

        const {fetchValuationDataFromSheets} = await import("../googleSheets");
        const result = await fetchValuationDataFromSheets();

        expect(result.rows).toHaveLength(1);
        expect(result.rows[0]?.symbol).toBe("AAPL");
        expect(result.warnings).toContain("美股 第 3 行缺少股票代號");
    });

    it("throws when every row is invalid", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    valueRanges: [
                        {
                            range: "港股!A2:K100",
                            values: [["0700.HK", "Tencent", "P/E", "10", "12", "18", "220", "180"]],
                        },
                    ],
                }),
            })
        );

        const {fetchValuationDataFromSheets} = await import("../googleSheets");

        await expect(fetchValuationDataFromSheets()).rejects.toThrow("Google Sheets 資料無法使用：港股 第 2 行估值下限高於上限");
    });
});
