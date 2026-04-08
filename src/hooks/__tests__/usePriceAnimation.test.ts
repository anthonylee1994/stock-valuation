import {renderHook} from "@testing-library/react";
import {act} from "react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {usePriceAnimation} from "@/hooks/usePriceAnimation";

describe("usePriceAnimation", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal(
            "requestAnimationFrame",
            vi.fn(callback => {
                callback(0);
                return 1;
            })
        );
        vi.stubGlobal("cancelAnimationFrame", vi.fn());
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("cleans up scheduled animation work on unmount", () => {
        const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

        const {rerender, unmount} = renderHook(({price}) => usePriceAnimation(price), {
            initialProps: {price: 100},
        });

        act(() => {
            rerender({price: 120});
        });

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();
    });
});
