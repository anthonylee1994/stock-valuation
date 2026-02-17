import React from "react";
import {ImArrowDown, ImArrowUp} from "react-icons/im";

interface Props {
    direction: "up" | "down";
    show: boolean;
}

export const PriceArrow = React.memo<Props>(({direction, show}) => {
    if (!show) return null;

    const isUp = direction === "up";
    const colorClass = isUp ? "text-success" : "text-danger";
    const animationClass = isUp ? "arrow-fade-up" : "arrow-fade-down";

    return <span className={`absolute right-full mr-1 top-0 ${colorClass} text-[1.5rem] ${animationClass} pointer-events-none`}>{isUp ? <ImArrowUp aria-hidden /> : <ImArrowDown aria-hidden />}</span>;
});
