import {formatPercent} from "./constants";

interface Props {
    potentialDownside: number;
    potentialUpside: number;
}

export const PotentialDisplay = ({potentialDownside, potentialUpside}: Props) => {
    return (
        <div className="flex justify-between items-center text-[0.8rem] gap-2 flex-wrap">
            <span className={`transition-colors duration-300 ${potentialDownside > 0 ? "text-green-500" : "text-red-500"}`}>
                距估值底部 {formatPercent(potentialDownside, true)}
            </span>
            <span className={`transition-colors duration-300 ${potentialUpside > 0 ? "text-green-500" : "text-red-500"}`}>
                距估值頂部 {formatPercent(potentialUpside, true)}
            </span>
        </div>
    );
};
