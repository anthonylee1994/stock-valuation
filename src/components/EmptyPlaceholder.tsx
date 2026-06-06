import React from "react";
import {AiOutlineStock} from "react-icons/ai";

interface Props {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export const EmptyPlaceholder = React.memo<Props>(({title = "沒有找到相關股票", description = "請確認股票代號或名稱是否正確", icon = <AiOutlineStock className="text-amber-300" />}) => (
    <div className="mx-auto max-w-[1600px] font-mono">
        <div className="border-t-4 border-r border-b border-l border-zinc-700 border-t-amber-300 bg-[#050505]">
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-[#111111] px-3 py-2">
                <div className="text-xl">{icon}</div>
                <span className="text-[13px] font-bold text-zinc-300 uppercase">沒有相關結果</span>
            </div>
            <div className="px-3 py-8 text-center">
                <h3 className="text-xl font-bold text-zinc-50">{title}</h3>
                {description && <p className="mt-2 text-[13px] font-bold text-zinc-500">{description}</p>}
            </div>
        </div>
    </div>
));
