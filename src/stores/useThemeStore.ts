import {create} from "zustand";
import {persist} from "zustand/middleware";

export type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#010203" : "#f5f5f7");
}

interface ThemeState {
    theme: Theme;
}

interface ThemeActions {
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            theme: "dark",
            setTheme: (theme: Theme) => {
                applyTheme(theme);
                set({theme});
            },
            toggleTheme: () => {
                const next: Theme = get().theme === "dark" ? "light" : "dark";
                applyTheme(next);
                set({theme: next});
            },
        }),
        {
            name: "stock-valuation-theme",
            onRehydrateStorage: () => state => {
                if (state) {
                    applyTheme(state.theme);
                }
            },
        }
    )
);

// 初次載入時嘗試從 localStorage 獲取並應用
if (typeof window !== "undefined") {
    try {
        const stored = localStorage.getItem("stock-valuation-theme");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.state?.theme) {
                applyTheme(parsed.state.theme);
            }
        } else {
            applyTheme("dark");
        }
    } catch {
        applyTheme("dark");
    }
}
