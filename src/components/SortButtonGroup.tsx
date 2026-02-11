import {ButtonGroup, Button} from "@heroui/react";

interface Props {
    sortOrder: "asc" | "desc";
    onSortOrderChange: (order: "asc" | "desc") => void;
}

export const SortButtonGroup = ({sortOrder, onSortOrderChange}: Props) => {
    return (
        <div className="max-w-[1400px] mx-auto mb-6 max-[640px]:text-center">
            <ButtonGroup>
                <Button className={sortOrder === "asc" ? "bg-green-500/80" : "bg-transparent"} variant={sortOrder === "asc" ? "primary" : "outline"} onPress={() => onSortOrderChange("asc")}>
                    由殘到貴 ↑
                </Button>
                <Button className={sortOrder === "desc" ? "bg-red-500/80" : "bg-transparent"} variant={sortOrder === "desc" ? "primary" : "outline"} onPress={() => onSortOrderChange("desc")}>
                    由貴到殘 ↓
                </Button>
            </ButtonGroup>
        </div>
    );
};
