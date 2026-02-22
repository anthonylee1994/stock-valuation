import {create} from "zustand";

const THEME_KEY = "stock-valuation-theme";

export type Theme = "light" | "dark";

function getStoredTheme(): Theme {
    if (typeof document === "undefined") return "dark";
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return "dark";
}

function applyTheme(theme: Theme) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#010203" : "#f5f5f7");
}

interface ThemeStore {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>(set => ({
    theme: getStoredTheme(),
    setTheme: (theme: Theme) => {
        localStorage.setItem(THEME_KEY, theme);
        applyTheme(theme);
        set({theme});
    },
    toggleTheme: () => {
        set(state => {
            const next: Theme = state.theme === "dark" ? "light" : "dark";
            localStorage.setItem(THEME_KEY, next);
            applyTheme(next);
            return {theme: next};
        });
    },
}));

// Apply stored theme on load (for React hydration; first paint handled by index.html script)
applyTheme(getStoredTheme());
