import {useEffect, useRef, useState} from "react";
import {formatPercent, formatPrice, getPriceColor} from "../constants";
import {PriceArrow} from "./PriceArrow";
import {MetricRow} from "./MetricRow";

interface Props {
    price: number;
    change: number;
    percentChange: number;
    forwardPE?: number;
    priceToBook?: number;
    dividendYield?: number;
}

interface AnimationState {
    flashClass: string;
    showArrow: boolean;
    arrowDirection: "up" | "down" | null;
}

export const PriceCard = ({price, change, percentChange, forwardPE, priceToBook, dividendYield}: Props) => {
    const prevPriceRef = useRef(price);
    const [animation, setAnimation] = useState<AnimationState>({
        flashClass: "",
        showArrow: false,
        arrowDirection: null,
    });
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (prevPriceRef.current === price) return;

        const isIncrease = price > prevPriceRef.current;
        const direction = isIncrease ? "up" : "down";

        setAnimation({
            flashClass: isIncrease ? "flash-green" : "flash-red",
            showArrow: true,
            arrowDirection: direction,
        });

        const flashTimer = setTimeout(() => setAnimation(prev => ({...prev, flashClass: ""})), 600);
        const arrowTimer = setTimeout(() => setAnimation(prev => ({...prev, showArrow: false, arrowDirection: null})), 2000);

        prevPriceRef.current = price;

        return () => {
            clearTimeout(flashTimer);
            clearTimeout(arrowTimer);
        };
    }, [price]);

    const priceColor = getPriceColor(change);

    const cardFaceStyle = {backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden"} as const;

    return (
        <div className="col-span-2" onClick={() => setIsFlipped(!isFlipped)} style={{perspective: "1000px"}}>
            <div
                className={`relative transition-transform duration-500 bg-slate-950/60 rounded-lg px-3 py-2 text-center transition-all duration-150 border-2 border-transparent cursor-pointer ${isFlipped ? "" : animation.flashClass}`}
                style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
                }}
            >
                {/* Front Face */}
                <div className="w-full" style={cardFaceStyle}>
                    <span className="block text-[0.7rem] text-slate-400 uppercase tracking-wider">現價</span>
                    <div className="mt-1 flex items-center justify-center flex-col">
                        <div className="relative inline-block">
                            {!isFlipped && animation.arrowDirection && <PriceArrow direction={animation.arrowDirection} show={animation.showArrow} />}
                            <div className={`text-[1.5rem] font-semibold ${priceColor}`}>{formatPrice(price)}</div>
                        </div>
                        <div className={`text-[1rem] font-medium ${priceColor}`}>
                            {formatPrice(change)} ({formatPercent(percentChange, true)})
                        </div>
                    </div>
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 w-full" style={{...cardFaceStyle, transform: "rotateY(180deg)"}}>
                    <div className="flex flex-col gap-1 p-2 mt-1">
                        <MetricRow label="預測市盈率" value={forwardPE ? forwardPE.toFixed(2) : "-"} />
                        <MetricRow label="市淨率" value={priceToBook ? priceToBook.toFixed(2) : "-"} />
                        <MetricRow label="股息率" value={dividendYield ? formatPercent(dividendYield, false) : "-"} />
                    </div>
                </div>
            </div>
        </div>
    );
};
