import React from "react";
import {Card, Chip} from "@heroui/react";
import {STATUS_CONFIG, getStatus} from "./constants";

interface Props {
    symbol: string;
    name: string;
    price: number;
    valuationLow: number;
    valuationHigh: number;
}

export const CardHeader = React.memo<Props>(({symbol, name, price, valuationLow, valuationHigh}) => {
    const status = getStatus(price, valuationLow, valuationHigh);
    const config = STATUS_CONFIG[status];

    return (
        <Card.Header className="flex flex-row items-start justify-between gap-3 px-5 pt-5 pb-0">
            <Card.Title id={`card-title-${symbol}`} className="m-0 min-w-0">
                <span className="block text-2xl font-bold tracking-tight text-foreground max-[480px]:text-xl">{symbol}</span>
                <span className="block text-sm text-muted truncate mt-0.5">{name}</span>
            </Card.Title>
            <Chip color={config.color} variant="soft" size="md" className="font-medium shrink-0">
                <config.icon className="mr-1.5 size-4" aria-hidden />
                {config.label}
            </Chip>
        </Card.Header>
    );
});
