import React from "react";
import {AiOutlineStock} from "react-icons/ai";

export const EmptyPlaceholder = React.memo(() => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <div className="bg-surface p-6 rounded-full mb-4 shadow-sm border-2 border-transparent">
            <AiOutlineStock className="text-4xl text-muted" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">沒有找到相關股票</h3>
    </div>
));
