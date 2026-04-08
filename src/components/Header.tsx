import React from "react";
import {ThemeSwitch} from "./ThemeSwitch";

interface Props {
    warnings: string[];
}

export const Header = React.memo<Props>(({warnings}) => {
    return (
        <header className="relative max-w-350 mx-auto mb-6">
            <div className="flex items-center justify-center gap-3 max-[640px]:justify-center max-[640px]:flex-col text-center text-[1.75rem] font-bold text-foreground tracking-wide max-[640px]:text-[1.35rem]">
                估值參考
                <ThemeSwitch />
            </div>
            {warnings.length > 0 && (
                <div className="mt-3 flex flex-col items-center gap-2 text-center">
                    <p className="max-w-3xl rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-sm text-amber-700 dark:text-amber-300">{warnings.join("；")}</p>
                </div>
            )}
        </header>
    );
});
