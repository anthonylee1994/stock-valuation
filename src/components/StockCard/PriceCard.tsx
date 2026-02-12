import {useEffect, useRef, useState} from "react";
import {formatPercent, formatPrice} from "./constants";

interface Props {
    price: number;
    change: number;
    percentChange: number;
    forwardPE?: number;
    priceToBook?: number;
    dividendYield?: number;
}

export const PriceCard = ({price, change, percentChange, forwardPE, priceToBook, dividendYield}: Props) => {
    const prevPriceRef = useRef<number>(price);
    const [flashClass, setFlashClass] = useState<string>("");
    const [showArrow, setShowArrow] = useState<boolean>(false);
    const [arrowDirection, setArrowDirection] = useState<"up" | "down" | null>(null);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    useEffect(() => {
        const prevPrice = prevPriceRef.current;

        if (prevPrice !== price) {
            const isIncrease = price > prevPrice;
            setFlashClass(isIncrease ? "flash-green" : "flash-red");
            setArrowDirection(isIncrease ? "up" : "down");
            setShowArrow(true);

            const flashTimer = setTimeout(() => setFlashClass(""), 600);
            const arrowTimer = setTimeout(() => {
                setShowArrow(false);
                setArrowDirection(null);
            }, 2000);

            prevPriceRef.current = price;

            return () => {
                clearTimeout(flashTimer);
                clearTimeout(arrowTimer);
            };
        }
    }, [price]);

    const priceColor = change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-slate-400";

    return (
        <div className="col-span-2" onClick={() => setIsFlipped(!isFlipped)} style={{perspective: "1000px"}}>
            <div
                className={`relative transition-transform duration-500 bg-slate-950/60 rounded-lg px-3 py-2 text-center transition-all duration-150 border-2 border-transparent cursor-pointer ${isFlipped ? "" : flashClass}`}
                style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* Front side - Price */}
                <div
                    className="w-full"
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                    }}
                >
                    <span className="block text-[0.7rem] text-slate-400 uppercase tracking-wider">現價</span>
                    <div className="mt-1 flex items-center justify-center flex-col">
                        <div className="relative inline-block">
                            {showArrow && arrowDirection === "up" && !isFlipped && (
                                <span className="absolute right-full mr-1 top-0 text-green-400 text-[1.5rem] arrow-fade-up pointer-events-none">▲</span>
                            )}
                            {showArrow && arrowDirection === "down" && !isFlipped && (
                                <span className="absolute right-full mr-1 top-0 text-red-400 text-[1.5rem] arrow-fade-down pointer-events-none">▼</span>
                            )}
                            <div className={`text-[1.5rem] font-semibold ${priceColor}`}>{formatPrice(price)}</div>
                        </div>
                        <div className={`text-[1rem] font-medium ${priceColor}`}>
                            {formatPrice(change)} ({formatPercent(percentChange, true)})
                        </div>
                    </div>
                </div>

                {/* Back side - Metrics */}
                <div
                    className="absolute inset-0 w-full"
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    <div className="flex flex-col gap-1 p-2 mt-1">
                        <div className="flex justify-between items-center">
                            <span className="text-[0.75rem] text-slate-400">預測市盈率</span>
                            <span className="text-[0.9rem] font-semibold text-slate-200">{forwardPE ? forwardPE.toFixed(2) : "-"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[0.75rem] text-slate-400">市淨率</span>
                            <span className="text-[0.9rem] font-semibold text-slate-200">{priceToBook ? priceToBook.toFixed(2) : "-"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[0.75rem] text-slate-400">股息率</span>
                            <span className="text-[0.9rem] font-semibold text-slate-200">{dividendYield ? formatPercent(dividendYield, false) : "-"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
