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
                            range: "估值模型!A2:A100",
                            values: [["P/E"]],
                        },
                        {
                            range: "板塊!A2:A100",
                            values: [["科技"]],
                        },
                        {
                            range: "美股!A2:L100",
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
                            range: "估值模型!A2:A100",
                            values: [["P/E"]],
                        },
                        {
                            range: "板塊!A2:A100",
                            values: [["科技"]],
                        },
                        {
                            range: "港股!A2:L100",
                            values: [["0700.HK", "Tencent", "P/E", "10", "12", "18", "220", "180"]],
                        },
                    ],
                }),
            })
        );

        const {fetchValuationDataFromSheets} = await import("../googleSheets");

        await expect(fetchValuationDataFromSheets()).rejects.toThrow("Google Sheets 資料無法使用：港股 第 2 行估值下限高於上限");
    });

    it("accepts metric types defined by the sheet", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    valueRanges: [
                        {
                            range: "估值模型!A2:A100",
                            values: [["FCF Yield"]],
                        },
                        {
                            range: "板塊!A2:A100",
                            values: [["科技"]],
                        },
                        {
                            range: "美股!A2:L100",
                            values: [["AAPL", "Apple", "FCF Yield", "10", "12", "18", "150", "180"]],
                        },
                    ],
                }),
            })
        );

        const {fetchValuationDataFromSheets} = await import("../googleSheets");
        const result = await fetchValuationDataFromSheets();

        expect(result.rows[0]?.metricType).toBe("FCF Yield");
        expect(result.warnings).toEqual([]);
    });

    it("rejects metric types not defined by the metric sheet", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    valueRanges: [
                        {
                            range: "估值模型!A2:A100",
                            values: [["P/E"]],
                        },
                        {
                            range: "板塊!A2:A100",
                            values: [["科技"]],
                        },
                        {
                            range: "美股!A2:L100",
                            values: [["AAPL", "Apple", "FCF Yield", "10", "12", "18", "150", "180"]],
                        },
                    ],
                }),
            })
        );

        const {fetchValuationDataFromSheets} = await import("../googleSheets");

        await expect(fetchValuationDataFromSheets()).rejects.toThrow("Google Sheets 資料無法使用：美股 第 2 行欄位「metricType」不受支援: FCF Yield");
    });

    it("accepts sectors defined by the sector sheet", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    valueRanges: [
                        {
                            range: "估值模型!A2:A100",
                            values: [["P/E"]],
                        },
                        {
                            range: "板塊!A2:A100",
                            values: [["科技"], ["醫療"]],
                        },
                        {
                            range: "美股!A2:L100",
                            values: [["AAPL", "Apple", "P/E", "10", "12", "18", "150", "180", "", "", "", "醫療"]],
                        },
                    ],
                }),
            })
        );

        const {fetchValuationDataFromSheets} = await import("../googleSheets");
        const result = await fetchValuationDataFromSheets();

        expect(result.rows[0]?.sector).toBe("醫療");
        expect(result.warnings).toEqual([]);
    });

    it("rejects sectors not defined by the sector sheet", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    valueRanges: [
                        {
                            range: "估值模型!A2:A100",
                            values: [["P/E"]],
                        },
                        {
                            range: "板塊!A2:A100",
                            values: [["科技"]],
                        },
                        {
                            range: "美股!A2:L100",
                            values: [["AAPL", "Apple", "P/E", "10", "12", "18", "150", "180", "", "", "", "醫療"]],
                        },
                    ],
                }),
            })
        );

        const {fetchValuationDataFromSheets} = await import("../googleSheets");

        await expect(fetchValuationDataFromSheets()).rejects.toThrow("Google Sheets 資料無法使用：美股 第 2 行欄位「sector」不受支援: 醫療");
    });
});
