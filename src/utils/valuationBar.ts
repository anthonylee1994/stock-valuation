interface BarPositions {
    markerPosition: number;
    lowPosition: number;
    highPosition: number;
}

export const calculateBarPositions = (price: number, valuationLow: number, valuationHigh: number): BarPositions => {
    const barMin = Math.min(valuationLow, price) * 0.9;
    const barMax = Math.max(valuationHigh, price) * 1.1;
    const barRange = barMax - barMin;

    if (barRange <= 0) {
        return {markerPosition: 50, lowPosition: 0, highPosition: 100};
    }

    return {
        markerPosition: ((price - barMin) / barRange) * 100,
        lowPosition: ((valuationLow - barMin) / barRange) * 100,
        highPosition: ((valuationHigh - barMin) / barRange) * 100,
    };
};
