import React from "react";
import type {Key} from "@heroui/react";
import type {Sector} from "@/types";
import {Label, ListBox, Select} from "@heroui/react";

const ALL_SECTORS = "all-sectors";
const ITEM_CLASS_NAME =
    "flex cursor-default items-center justify-between rounded-[2px] px-3 py-2 font-mono text-[12px] font-bold text-zinc-100 outline-none data-[focused=true]:bg-zinc-700 data-[selected=true]:text-amber-300";

interface Props {
    sectors: Sector[];
    value: Sector | null;
    onChange: (sector: Sector | null) => void;
}

export const SectorFilterSelect = React.memo<Props>(({sectors, value, onChange}) => {
    const handleChange = (selectedValue: Key | Key[] | null) => {
        if (Array.isArray(selectedValue)) {
            return;
        }

        onChange(selectedValue === null || selectedValue === ALL_SECTORS ? null : String(selectedValue));
    };

    return (
        <Select className="w-full gap-0 sm:w-44" value={value ?? ALL_SECTORS} onChange={handleChange}>
            <Label className="sr-only">板塊篩選</Label>
            <Select.Trigger className="h-9 rounded-[2px] border border-zinc-700 bg-[#050505] px-3 shadow-none outline-none data-[focus-visible=true]:ring-1 data-[focus-visible=true]:ring-amber-400">
                <Select.Value className="font-mono text-[12px] font-bold text-zinc-100" />
                <Select.Indicator className="text-zinc-400" />
            </Select.Trigger>
            <Select.Popover className="rounded-[2px] border border-zinc-700 bg-zinc-900 p-1 shadow-xl">
                <ListBox className="p-0">
                    <ListBox.Item id={ALL_SECTORS} textValue="所有板塊" className={ITEM_CLASS_NAME}>
                        所有板塊
                    </ListBox.Item>
                    {sectors.map(sector => (
                        <ListBox.Item key={sector} id={sector} textValue={sector} className={ITEM_CLASS_NAME}>
                            {sector}
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
});
