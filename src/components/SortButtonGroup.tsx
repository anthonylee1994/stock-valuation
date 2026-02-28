import {SearchField, Tabs} from "@heroui/react";
import React from "react";

interface Props {
    sortOrder: "asc" | "desc";
    onSortOrderChange: (order: "asc" | "desc") => void;
    marketFilter: string;
    onMarketFilterChange: (market: string) => void;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
}

export const SortButtonGroup = React.memo<Props>(({sortOrder, onSortOrderChange, marketFilter, onMarketFilterChange, searchQuery, onSearchQueryChange}) => {
    return (
        <div className="max-w-350 mx-auto mb-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex w-full items-center justify-between sm:w-auto md:justify-start gap-4 flex-wrap">
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
                </Tabs>
            </div>

            <SearchField value={searchQuery} onChange={onSearchQueryChange} className="w-full sm:w-55">
                <SearchField.Group className="rounded-full h-10">
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="尋找股票代號" className="text-sm" />
                    <SearchField.ClearButton />
                </SearchField.Group>
            </SearchField>
        </div>
    );
});
