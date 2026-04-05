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

        // 使用 requestAnimationFrame 避免同步 setState
        requestAnimationFrame(() => {
            setFlashClass(className);

            const timer = setTimeout(() => {
                setFlashClass("");
            }, 600);

            return () => clearTimeout(timer);
        });
    }, [price]);

    return {flashClass};
};
