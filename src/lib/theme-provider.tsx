import { ScriptOnce } from "@tanstack/react-router";
import { createContext, ReactNode, use, useEffect, useState } from "react";
import {createClientOnlyFn, createIsomorphicFn } from "@tanstack/react-start";
import { z } from "zod";

const UserThemeSchema = z.enum(["light", "dark", "system"]).catch("system");
const AppThemeSchema = z.enum(["light", "dark"]).catch("light");

export type UserTheme = z.infer<typeof UserThemeSchema>;
export type AppTheme = z.infer<typeof AppThemeSchema>;

const themeStorageKey = "ui-theme";

const getStoredUserTheme = createIsomorphicFn()
    .server((): UserTheme => "system")
    .client((): UserTheme => {
        const stored = localStorage.getItem(themeStorageKey);
        return UserThemeSchema.parse(stored);
    });

const setStoredTheme = createClientOnlyFn((theme: UserTheme) => {
    const validatedTheme = UserThemeSchema.parse(theme);
    localStorage.setItem(themeStorageKey, validatedTheme);
});

const getSystemTheme = createIsomorphicFn()
    .server((): AppTheme => "light")
    .client((): AppTheme => {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

const handleThemeChange = createClientOnlyFn((userTheme: UserTheme) => {
    const validatedTheme = UserThemeSchema.parse(userTheme);

    const root = document.documentElement;
    root.classList.remove("light", "dark", "system");

    if (validatedTheme === "system") {
        const systemTheme = getSystemTheme();
        root.classList.add(systemTheme, "system");
    } else {
        root.classList.add(validatedTheme);
    }
});

const setupPreferredListener = createClientOnlyFn(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => handleThemeChange("system");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
});

const themeScript = (function () {
    function themeFn() {
        try {
            const storedTheme = localStorage.getItem("ui-theme") || "system";
            const validTheme = ["light", "dark", "system"].includes(storedTheme)
                ? storedTheme
                : "system";

            if (validTheme === "system") {
                const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                    .matches
                    ? "dark"
                    : "light";
                document.documentElement.classList.add(systemTheme, "system");
            } else {
                document.documentElement.classList.add(validTheme);
            }
        } catch (e) {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";
            document.documentElement.classList.add(systemTheme, "system");
        }
    }
    return `(${themeFn.toString()})();`;
})();

type ThemeContextProps = {
    userTheme: UserTheme;
    appTheme: AppTheme;
    setTheme: (theme: UserTheme) => void;
};
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

type ThemeProviderProps = {
    children: ReactNode;
    forcedTheme?: UserTheme;
    defaultTheme?: UserTheme;
    disableTransitionOnChange?: boolean;
};

export function ThemeProvider({
                                  children,
                                  forcedTheme,
                                  defaultTheme = "system",
                                  disableTransitionOnChange = false,
                              }: ThemeProviderProps) {
    const [userTheme, setUserTheme] = useState<UserTheme>(
        forcedTheme ?? (getStoredUserTheme() || defaultTheme)
    );

    useEffect(() => {
        if (forcedTheme) {
            handleThemeChange(forcedTheme);
            return;
        }
        if (userTheme !== "system") return;
        return setupPreferredListener();
    }, [forcedTheme, userTheme]);

    const resolvedTheme = forcedTheme ?? userTheme;
    const appTheme = resolvedTheme === "system" ? getSystemTheme() : resolvedTheme;

    const setTheme = (newUserTheme: UserTheme) => {
        if (forcedTheme) return; // no-op when forced
        const validatedTheme = UserThemeSchema.parse(newUserTheme);

        if (disableTransitionOnChange) {
            document.documentElement.classList.add("[&_*]:!transition-none");
            window.setTimeout(() => {
                document.documentElement.classList.remove("[&_*]:!transition-none");
            }, 0);
        }

        setUserTheme(validatedTheme);
        setStoredTheme(validatedTheme);
        handleThemeChange(validatedTheme);
    };

    return (
        <ThemeContext value={{ userTheme: resolvedTheme, appTheme, setTheme }}>
            <ScriptOnce children={themeScript} />
            {children}
        </ThemeContext>
    );
}

export const useTheme = () => {
    const context = use(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};