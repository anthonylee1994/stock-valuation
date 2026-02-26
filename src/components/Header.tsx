import React from "react";
import {Button} from "@heroui/react";
import {FiMoon, FiSun} from "react-icons/fi";
import {useThemeStore} from "@/stores/useThemeStore";

interface Props {
    lastUpdate: string | null;
    pulse: boolean;
}

export const Header = React.memo<Props>(({lastUpdate, pulse}) => {
    const {theme, toggleTheme} = useThemeStore();

    return (
        <header className="flex flex-wrap items-center justify-between gap-3 max-w-350 mx-auto mb-6 max-[640px]:justify-center max-[640px]:flex-col">
            <h1 className="m-0 text-[1.75rem] font-bold text-foreground tracking-wide max-[640px]:text-[1.35rem]">估值參考</h1>
            <div className="flex items-center gap-2">
                <Button isIconOnly variant="tertiary" size="sm" onPress={toggleTheme} aria-label={theme === "dark" ? "切換至淺色模式" : "切換至深色模式"}>
                    {theme === "dark" ? <FiSun size={20} aria-hidden /> : <FiMoon size={20} aria-hidden />}
                </Button>
                {lastUpdate && <span className="text-[0.8rem] text-muted">更新時間: {lastUpdate}</span>}
                {lastUpdate && <div className={`w-2 h-2 rounded-full ${pulse ? "bg-success pulse-glow" : "bg-muted"}`} />}
            </div>
        </header>
    );
});
