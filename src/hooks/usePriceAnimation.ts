import {useEffect, useRef, useState} from "react";

interface AnimationState {
    flashClass: string;
    showArrow: boolean;
    arrowDirection: "up" | "down" | null;
}

export const usePriceAnimation = (price: number) => {
    const prevPriceRef = useRef(price);
    const [animation, setAnimation] = useState<AnimationState>({
        flashClass: "",
        showArrow: false,
        arrowDirection: null,
    });

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

    return animation;
};
