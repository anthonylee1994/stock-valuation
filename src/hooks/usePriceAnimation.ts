import {useEffect, useRef, useState} from "react";

export const usePriceAnimation = (price: number) => {
    const prevPriceRef = useRef(price);
    const [flashClass, setFlashClass] = useState("");

    useEffect(() => {
        if (prevPriceRef.current === price) return;

        const isIncrease = price > prevPriceRef.current;
        setFlashClass(isIncrease ? "flash-green" : "flash-red");
        prevPriceRef.current = price;

        const timer = setTimeout(() => setFlashClass(""), 600);
        return () => clearTimeout(timer);
    }, [price]);

    return {flashClass};
};
