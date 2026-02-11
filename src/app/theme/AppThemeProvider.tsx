import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from "react-native-paper";

import type { ThemeMode, ThemeTokens } from "@/app/theme/types";

type AppThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  theme: MD3Theme;
  tokens: ThemeTokens;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function resolveMode(
  mode: ThemeMode,
  system: "light" | "dark" | null | undefined,
): "light" | "dark" {
  if (mode === "light") return "light";
  if (mode === "dark") return "dark";
  return system === "dark" ? "dark" : "light";
}

function buildTokens(theme: MD3Theme): ThemeTokens {
  const c = theme.colors;

  return {
    screen: { background: c.background },
    text: { primary: c.onBackground, secondary: c.onSurfaceVariant },
    card: { background: c.surface, border: c.outlineVariant },
    button: { primaryBackground: c.primary, primaryText: c.onPrimary },
    divider: { subtle: c.outlineVariant },
  };
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  const value = useMemo<AppThemeContextValue>(() => {
    const resolved = resolveMode(mode, system);
    const theme = resolved === "dark" ? MD3DarkTheme : MD3LightTheme;
    const tokens = buildTokens(theme);
    return { mode, setMode, theme, tokens };
  }, [mode, system]);

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within AppThemeProvider");
  return ctx;
}
