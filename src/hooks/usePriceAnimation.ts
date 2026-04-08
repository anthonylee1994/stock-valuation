import {useEffect, useRef, useState} from "react";

export const usePriceAnimation = (price: number) => {
    const prevPriceRef = useRef(price);
    const [flashClass, setFlashClass] = useState("");

    useEffect(() => {
        if (prevPriceRef.current === price) return;

        const isIncrease = price > prevPriceRef.current;
        const className = isIncrease ? "flash-green" : "flash-red";

        // 更新價格引用，以便下一次比較
        prevPriceRef.current = price;

        let timer: ReturnType<typeof setTimeout> | null = null;
        const frame = requestAnimationFrame(() => {
            setFlashClass(className);

            timer = setTimeout(() => {
                setFlashClass("");
            }, 600);
        });

        return () => {
            cancelAnimationFrame(frame);
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [price]);

    return {flashClass};
};
