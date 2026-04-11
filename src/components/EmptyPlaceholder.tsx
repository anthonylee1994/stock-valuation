import React from "react";
import {AiOutlineStock} from "react-icons/ai";

interface Props {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export const EmptyPlaceholder = React.memo<Props>(({title = "沒有找到相關股票", description = "請確認股票代號或名稱是否正確", icon = <AiOutlineStock className="text-muted text-4xl" />}) => (
    <div className="animate-in fade-in flex flex-col items-center justify-center py-20 text-center duration-500">
        <div className="bg-surface mb-4 rounded-full border-2 border-transparent p-6 shadow-sm">{icon}</div>
        <h3 className="text-foreground mb-2 text-lg font-bold">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
));
