import { useState, useEffect, createContext, type ReactNode } from "react";
import axios from "axios";

type ThemeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
    setTheme: (theme: "light" | "dark") => void;
};

export const ThemeContext: React.Context<ThemeContextType> = createContext<ThemeContextType>({
    darkMode: false,
    toggleDarkMode: () => {},
    setTheme: () => {},
});

type ThemeProviderProps = {
    children: ReactNode;
};

const getApiBaseUrl = () => {
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
    }
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:5000/api`;
};

const updateThemeOnServer = async (theme: "light" | "dark") => {
    try {
        const token = localStorage.getItem("Token") || localStorage.getItem("token");
        if (!token) return;
        
        await axios.put(
            `${getApiBaseUrl()}/profile/theme`,
            { theme },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("Error saving theme to server:", error);
    }
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [darkMode, setDarkMode] = useState(false);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const initTheme = async () => {
            const savedTheme = localStorage.getItem("userThemePreference");
            if (savedTheme) {
                setDarkMode(savedTheme === "dark");
                setInitialized(true);
            } else {
                setInitialized(true);
            }
        };
        initTheme();
    }, []);

    useEffect(() => {
        if (!initialized) return;
        
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [darkMode, initialized]);

    const toggleDarkMode = () => {
        const newTheme = darkMode ? "light" : "dark";
        setDarkMode(!darkMode);
        localStorage.setItem("userThemePreference", newTheme);
        updateThemeOnServer(newTheme);
    };

    const setTheme = (theme: "light" | "dark") => {
        setDarkMode(theme === "dark");
        localStorage.setItem("userThemePreference", theme);
        updateThemeOnServer(theme);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;