import {ButtonGroup, Button} from "@heroui/react";

interface Props {
    sortOrder: "asc" | "desc";
    onSortOrderChange: (order: "asc" | "desc") => void;
}

export const SortButtonGroup = ({sortOrder, onSortOrderChange}: Props) => {
    return (
        <div className="max-w-[1400px] mx-auto mb-6 max-[640px]:text-center">
            <ButtonGroup variant="outline">
                <Button className={sortOrder === "asc" ? "bg-green-500" : "bg-transparent"} onPress={() => onSortOrderChange("asc")}>
                    由殘到貴 ↑
                </Button>
                <Button className={sortOrder === "desc" ? "bg-red-500" : "bg-transparent"} onPress={() => onSortOrderChange("desc")}>
                    由貴到殘 ↓
                </Button>
            </ButtonGroup>
        </div>
    );
};
