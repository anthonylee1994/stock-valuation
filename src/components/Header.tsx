import React from "react";
import {ThemeSwitch} from "./ThemeSwitch";

export const Header = React.memo(() => {
    return (
        <header className="relative flex items-center justify-center gap-3 max-w-350 mx-auto mb-6 max-[640px]:justify-center max-[640px]:flex-col text-center text-[1.75rem] font-bold text-foreground tracking-wide max-[640px]:text-[1.35rem]">
            估值參考
            <ThemeSwitch />
        </header>
    );
});
