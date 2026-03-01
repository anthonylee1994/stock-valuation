import React from "react";
import {AiOutlineStock} from "react-icons/ai";

interface Props {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export const EmptyPlaceholder = React.memo<Props>(({title = "沒有找到相關股票", description = "請確認股票代號或名稱是否正確", icon = <AiOutlineStock className="text-4xl text-muted" />}) => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <div className="bg-surface p-6 rounded-full mb-4 shadow-sm border-2 border-transparent">{icon}</div>
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
));
