import React from "react";

interface Props {
    warnings: string[];
}

export const Header = React.memo<Props>(({warnings}) => {
    return (
        <header className="mx-auto w-full font-mono">
            <div className="grid grid-cols-[auto_1fr] items-center bg-[#9d0b1f]">
                <h1 className="w-fit justify-self-start bg-amber-400 px-4 py-2 text-left text-xl font-black tracking-normal text-zinc-950 max-[640px]:px-2 max-[640px]:text-xl">估值參考</h1>
                <div className="pl-3">Stock Valuation</div>
            </div>
            {warnings.length > 0 && (
                <div className="mt-3 flex flex-col items-center gap-2 text-center">
                    <p className="max-w-3xl border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-xs font-bold text-amber-300">{warnings.join("；")}</p>
                </div>
            )}
        </header>
    );
});
