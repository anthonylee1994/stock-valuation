import {Tabs as HUITabs} from "@heroui/react";
import React from "react";

interface Props<Key extends string> {
    value?: Key;
    setValue: (value: Key) => void;
    items: Record<Key, string>;
}

const INDICATOR_STYLE: React.CSSProperties = {
    transitionDuration: "500ms",
    transitionProperty: "translate, width, height, background-color",
    transitionTimingFunction: "var(--ease-out-fluid)",
};

const TabsImpl = <Key extends string>({value: filter, setValue: setFilter, items: names}: Props<Key>) => (
    <HUITabs selectedKey={filter} onSelectionChange={key => setFilter(key as Key)} className="w-fit">
        <HUITabs.List>
            {Object.entries(names).map(([key, label]) => (
                <HUITabs.Tab key={key} id={key}>
                    {label as string}
                    <HUITabs.Indicator style={INDICATOR_STYLE} />
                </HUITabs.Tab>
            ))}
        </HUITabs.List>
    </HUITabs>
);

export const Tabs = React.memo(TabsImpl) as typeof TabsImpl;
