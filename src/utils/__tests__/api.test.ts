import {afterEach, describe, expect, it, vi} from "vitest";
import {getJson} from "@/utils/api";

function response(status: number, data: unknown = {}) {
    return {
        ok: status >= 200 && status < 300,
        status,
        statusText: status === 200 ? "OK" : "Error",
        json: vi.fn().mockResolvedValue(data),
    } as unknown as Response;
}

describe("getJson", () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it("returns parsed JSON from a successful request", async () => {
        const fetchMock = vi.fn().mockResolvedValue(response(200, {quotes: []}));
        vi.stubGlobal("fetch", fetchMock);

        await expect(getJson("/quotes")).resolves.toEqual({quotes: []});
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("retries a server failure with exponential backoff", async () => {
        vi.useFakeTimers();
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(response(500))
            .mockResolvedValueOnce(response(200, {quotes: []}));
        vi.stubGlobal("fetch", fetchMock);

        const request = getJson("/quotes");
        await vi.advanceTimersByTimeAsync(1000);

        await expect(request).resolves.toEqual({quotes: []});
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("does not retry a client failure", async () => {
        const fetchMock = vi.fn().mockResolvedValue(response(404));
        vi.stubGlobal("fetch", fetchMock);

        await expect(getJson("/quotes")).rejects.toThrow("API request failed: 404 Error");
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("does not retry an externally aborted request", async () => {
        const controller = new AbortController();
        controller.abort();
        const fetchMock = vi.fn().mockRejectedValue(new DOMException("Request aborted", "AbortError"));
        vi.stubGlobal("fetch", fetchMock);

        await expect(getJson("/quotes", controller.signal)).rejects.toThrow("Request aborted");
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});
