import {Button} from "@heroui/react";
import {useThemeStore} from "../store/useThemeStore";

interface Props {
    lastUpdate: string | null;
    pulse: boolean;
}

const SunIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.25rem"
        height="1.25rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
    >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
);

const MoonIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.25rem"
        height="1.25rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
    >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
);

export const Header = ({lastUpdate, pulse}: Props) => {
    const {theme, toggleTheme} = useThemeStore();

    return (
        <header className="flex flex-wrap items-center justify-between gap-3 max-w-[1400px] mx-auto mb-6 max-[640px]:justify-center max-[640px]:flex-col">
            <h1 className="m-0 text-[1.75rem] font-bold text-foreground tracking-wide max-[640px]:text-[1.35rem]">估值參考</h1>
            <div className="flex items-center gap-2">
                <Button isIconOnly variant="tertiary" size="sm" onPress={toggleTheme} aria-label={theme === "dark" ? "切換至淺色模式" : "切換至深色模式"}>
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </Button>
                {lastUpdate && <span className="text-[0.8rem] text-muted">更新時間: {lastUpdate}</span>}
                {lastUpdate && <div className={`w-2 h-2 rounded-full ${pulse ? "bg-success pulse-glow" : "bg-muted"}`} />}
            </div>
        </header>
    );
};
