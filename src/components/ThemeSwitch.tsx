import {useThemeStore} from "@/stores/useThemeStore";
import {Button} from "@heroui/react";
import React from "react";
import {FiMoon, FiSun} from "react-icons/fi";

export const ThemeSwitch = React.memo(() => {
    const {theme, toggleTheme} = useThemeStore();

    return (
        <Button className="absolute top-0 right-0" isIconOnly variant="tertiary" size="sm" onPress={toggleTheme} aria-label={theme === "dark" ? "切換至淺色模式" : "切換至深色模式"}>
            {theme === "dark" ? <FiSun size={20} aria-hidden /> : <FiMoon size={20} aria-hidden />}
        </Button>
    );
});
