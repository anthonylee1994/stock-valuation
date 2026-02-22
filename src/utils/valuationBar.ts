interface BarPositions {
    barMin: number;
    barMax: number;
    barRange: number;
    markerPosition: number;
    lowPosition: number;
    highPosition: number;
}

export const calculateBarPositions = (price: number, valuationLow: number, valuationHigh: number): BarPositions => {
    const barMin = Math.min(valuationLow, price) * 0.9;
    const barMax = Math.max(valuationHigh, price) * 1.1;
    const barRange = barMax - barMin;

    return {
        barMin,
        barMax,
        barRange,
        markerPosition: barRange > 0 ? ((price - barMin) / barRange) * 100 : 50,
        lowPosition: barRange > 0 ? ((valuationLow - barMin) / barRange) * 100 : 0,
        highPosition: barRange > 0 ? ((valuationHigh - barMin) / barRange) * 100 : 100,
    };
};
