import {Tabs} from "@heroui/react";

interface Props {
    sortOrder: "asc" | "desc";
    onSortOrderChange: (order: "asc" | "desc") => void;
    marketFilter: "hk" | "us";
    onMarketFilterChange: (market: "hk" | "us") => void;
}

export const SortButtonGroup = ({sortOrder, onSortOrderChange, marketFilter, onMarketFilterChange}: Props) => {
    return (
        <div className="max-w-[1400px] mx-auto mb-6 flex items-center justify-between gap-4 flex-wrap">
            <Tabs selectedKey={sortOrder} onSelectionChange={key => onSortOrderChange(key as "asc" | "desc")} className="w-fit">
                <Tabs.ListContainer>
                    <Tabs.List aria-label="排序">
                        <Tabs.Tab id="asc">
                            由殘到貴
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="desc">
                            由貴到殘
                            <Tabs.Indicator />
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

            <Tabs selectedKey={marketFilter} onSelectionChange={key => onMarketFilterChange(key as "hk" | "us")} className="w-fit">
                <Tabs.ListContainer>
                    <Tabs.List aria-label="市場">
                        <Tabs.Tab id="us">
                            美股
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="hk">
                            港股
                            <Tabs.Indicator />
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
};
