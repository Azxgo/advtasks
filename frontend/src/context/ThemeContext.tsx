import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";

type ThemeContextType = {
    dark: boolean;
    setDark: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ThemeContext = createContext<ThemeContextType | null>(null)

export const useThemeContext = () => {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error("useThemeContext debe usarse dentro de ThemeProvider")
    }

    return context
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [dark, setDark] = useState(() => {
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme !== null) {
            return savedTheme === "dark"
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    })

    useLayoutEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    return (
        <ThemeContext.Provider value={{ dark, setDark }}>
            {children}
        </ThemeContext.Provider>
    )
}

