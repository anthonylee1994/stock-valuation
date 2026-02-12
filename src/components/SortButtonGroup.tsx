import {ButtonGroup, Button} from "@heroui/react";

interface Props {
    sortOrder: "asc" | "desc";
    onSortOrderChange: (order: "asc" | "desc") => void;
    marketFilter: "hk" | "us";
    onMarketFilterChange: (market: "hk" | "us") => void;
}

export const SortButtonGroup = ({sortOrder, onSortOrderChange, marketFilter, onMarketFilterChange}: Props) => {
    return (
        <div className="max-w-[1400px] mx-auto mb-6 flex items-center justify-between gap-4">
            <ButtonGroup variant="outline">
                <Button className={sortOrder === "asc" ? "bg-green-500" : "bg-transparent"} onPress={() => onSortOrderChange("asc")}>
                    由殘到貴 ↑
                </Button>
                <Button className={sortOrder === "desc" ? "bg-red-500" : "bg-transparent"} onPress={() => onSortOrderChange("desc")}>
                    由貴到殘 ↓
                </Button>
            </ButtonGroup>

            <ButtonGroup variant="outline">
                <Button className={marketFilter === "us" ? "bg-blue-500" : "bg-transparent"} onPress={() => onMarketFilterChange("us")}>
                    美股
                </Button>
                <Button className={marketFilter === "hk" ? "bg-blue-500" : "bg-transparent"} onPress={() => onMarketFilterChange("hk")}>
                    港股
                </Button>
            </ButtonGroup>
        </div>
    );
};
