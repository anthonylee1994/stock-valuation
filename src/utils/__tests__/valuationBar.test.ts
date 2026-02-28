import {describe, expect, it} from "vitest";
import {calculateBarPositions} from "../valuationBar";

describe("calculateBarPositions", () => {
    it("should calculate positions correctly for normal values", () => {
        const result = calculateBarPositions(100, 80, 120);
        expect(result.markerPosition).toBeGreaterThan(0);
        expect(result.markerPosition).toBeLessThan(100);
        expect(result.lowPosition).toBeGreaterThan(0);
        expect(result.lowPosition).toBeLessThan(100);
        expect(result.highPosition).toBeGreaterThan(0);
        expect(result.highPosition).toBeLessThan(100);
    });

    it("should handle price at valuation low", () => {
        const result = calculateBarPositions(100, 100, 120);
        expect(result.markerPosition).toBeCloseTo(result.lowPosition, 1);
    });

    it("should handle price at valuation high", () => {
        const result = calculateBarPositions(100, 80, 100);
        expect(result.markerPosition).toBeCloseTo(result.highPosition, 1);
    });

    it("should handle price in middle of valuation range", () => {
        const result = calculateBarPositions(100, 80, 120);
        expect(result.lowPosition).toBeLessThan(result.markerPosition);
        expect(result.markerPosition).toBeLessThan(result.highPosition);
    });

    it("should handle all values equal (same price, low, and high)", () => {
        const result = calculateBarPositions(100, 100, 100);
        expect(result.markerPosition).toBeCloseTo(50, 1);
        expect(result.lowPosition).toBeCloseTo(50, 1);
        expect(result.highPosition).toBeCloseTo(50, 1);
    });

    it("should handle extreme small values where bar range could be very small", () => {
        const result = calculateBarPositions(0.0001, 0.0001, 0.0001);
        expect(result.markerPosition).toBeCloseTo(50, 1);
        expect(result.lowPosition).toBeCloseTo(50, 1);
        expect(result.highPosition).toBeCloseTo(50, 1);
    });

    it("should handle price below valuation low", () => {
        const result = calculateBarPositions(50, 80, 120);
        expect(result.markerPosition).toBeLessThan(result.lowPosition);
    });

    it("should handle price above valuation high", () => {
        const result = calculateBarPositions(150, 80, 120);
        expect(result.markerPosition).toBeGreaterThan(result.highPosition);
    });

    it("should handle negative prices", () => {
        const result = calculateBarPositions(-100, -120, -80);
        expect(result.markerPosition).toBeGreaterThan(0);
        expect(result.markerPosition).toBeLessThan(100);
    });

    it("should handle very small values", () => {
        const result = calculateBarPositions(0.1, 0.05, 0.15);
        expect(result.markerPosition).toBeGreaterThan(0);
        expect(result.markerPosition).toBeLessThan(100);
    });

    it("should handle very large values", () => {
        const result = calculateBarPositions(1000000, 800000, 1200000);
        expect(result.markerPosition).toBeGreaterThan(0);
        expect(result.markerPosition).toBeLessThan(100);
    });
});
