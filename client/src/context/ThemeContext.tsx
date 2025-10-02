import { useState, useEffect, createContext, type ReactNode } from "react";

type ThemeContextType = {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ThemeContext: React.Context<ThemeContextType> = createContext<ThemeContextType>({
    darkMode: false,
    setDarkMode: () => {},
});

type ThemeProviderProps = {
    children: ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    
    const [darkMode, setDarkMode] = useState(() => {
        const theme: string | null = localStorage.getItem('Theme');
        if(theme === null) {
            localStorage.setItem("Theme", 'LIGHT');
            return false;
        }
        return theme === 'DARK';
    });

    useEffect(() => {
        const root:HTMLElement = document.documentElement;
        root.classList.toggle('dark', darkMode);
        localStorage.setItem('Theme', darkMode ? 'DARK' : 'LIGHT');
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>

    );
}

export default ThemeProvider;