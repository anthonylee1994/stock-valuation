import React from "react";
import {Tabs} from "@heroui/react";

interface Props {
    sortOrder: "asc" | "desc";
    onSortOrderChange: (order: "asc" | "desc") => void;
    marketFilter: string;
    onMarketFilterChange: (market: string) => void;
}

export const SortButtonGroup = React.memo<Props>(({sortOrder, onSortOrderChange, marketFilter, onMarketFilterChange}) => {
    return (
        <div className="max-w-[1400px] mx-auto mb-6 flex items-center justify-between gap-4 flex-wrap">
            <Tabs selectedKey={sortOrder} onSelectionChange={key => onSortOrderChange(key as "asc" | "desc")} className="w-fit">
                <Tabs.ListContainer>
                    <Tabs.List aria-label="排序" className="transition-all duration-100">
                        <Tabs.Tab id="asc">
                            由殘到貴
                            <Tabs.Indicator
                                style={{
                                    transitionDuration: "500ms",
                                    transitionProperty: "translate, width, height, background-color",
                                    transitionTimingFunction: "var(--ease-out-fluid)",
                                }}
                            />
                        </Tabs.Tab>
                        <Tabs.Tab id="desc">
                            由貴到殘
                            <Tabs.Indicator
                                style={{
                                    transitionDuration: "500ms",
                                    transitionProperty: "translate, width, height, background-color",
                                    transitionTimingFunction: "var(--ease-out-fluid)",
                                }}
                            />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
                <Tabs.Panel id="asc" className="hidden">
                    {null}
                </Tabs.Panel>
                <Tabs.Panel id="desc" className="hidden">
                    {null}
                </Tabs.Panel>
            </Tabs>

            <Tabs selectedKey={marketFilter} onSelectionChange={key => onMarketFilterChange(key as string)} className="w-fit">
                <Tabs.ListContainer>
                    <Tabs.List aria-label="市場" className="transition-all duration-100">
                        <Tabs.Tab id="us_market">
                            美股
                            <Tabs.Indicator
                                style={{
                                    transitionDuration: "500ms",
                                    transitionProperty: "translate, width, height, background-color",
                                    transitionTimingFunction: "var(--ease-out-fluid)",
                                }}
                            />
                        </Tabs.Tab>
                        <Tabs.Tab id="hk_market">
                            港股
                            <Tabs.Indicator
                                style={{
                                    transitionDuration: "500ms",
                                    transitionProperty: "translate, width, height, background-color",
                                    transitionTimingFunction: "var(--ease-out-fluid)",
                                }}
                            />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
                <Tabs.Panel id="us" className="hidden">
                    {null}
                </Tabs.Panel>
                <Tabs.Panel id="hk" className="hidden">
                    {null}
                </Tabs.Panel>
            </Tabs>
        </div>
    );
});
