import React from "react";
import {Tabs as HUITabs} from "@heroui/react";

interface Props<Key extends string> {
    value?: Key;
    setValue: (value: Key) => void;
    items: Record<Key, string>;
    ariaLabel: string;
}

const INDICATOR_STYLE: React.CSSProperties = {
    transitionDuration: "500ms",
    transitionProperty: "translate, width, height, background-color",
    transitionTimingFunction: "var(--ease-out-fluid)",
};

const TabsImpl = <Key extends string>({value: filter, setValue: setFilter, items: names, ariaLabel}: Props<Key>) => (
    <HUITabs selectedKey={filter} onSelectionChange={key => setFilter(key as Key)} className="w-fit font-mono">
        <HUITabs.List
            aria-label={ariaLabel}
            className="h-9 overflow-hidden rounded-[2px] border-0 bg-zinc-800 p-0 *:h-9 *:rounded-none *:border-0 *:px-4 *:text-[13px] *:font-bold *:text-zinc-100 *:uppercase *:data-[selected=true]:text-white"
        >
            {Object.entries(names).map(([key, label]) => (
                <HUITabs.Tab key={key} id={key}>
                    {label as string}
                    <HUITabs.Indicator className="rounded-none bg-zinc-600" style={INDICATOR_STYLE} />
                </HUITabs.Tab>
            ))}
        </HUITabs.List>
    </HUITabs>
);

export const Tabs = React.memo(TabsImpl) as typeof TabsImpl;
