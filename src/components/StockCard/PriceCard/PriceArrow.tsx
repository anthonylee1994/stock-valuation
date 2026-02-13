interface Props {
    direction: "up" | "down";
    show: boolean;
}

export const PriceArrow = ({direction, show}: Props) => {
    if (!show) return null;

    const isUp = direction === "up";
    const colorClass = isUp ? "text-green-400" : "text-red-400";
    const animationClass = isUp ? "arrow-fade-up" : "arrow-fade-down";

    return <span className={`absolute right-full mr-1 top-0 ${colorClass} text-[1.5rem] ${animationClass} pointer-events-none`}>{isUp ? "▲" : "▼"}</span>;
};
