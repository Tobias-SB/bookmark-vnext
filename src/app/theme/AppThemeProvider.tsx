// src/app/theme/AppThemeProvider.tsx
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  type MD3Theme,
} from "react-native-paper";

import { loadThemeMode, saveThemeMode } from "@/app/theme/storage";
import type { ThemeMode, ThemeTokens } from "@/app/theme/types";
import { useIsMounted } from "@/shared/hooks";

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
    chip: {
      background: c.surfaceVariant,
      border: c.outlineVariant,
      text: c.onSurfaceVariant,
      selectedBackground: c.primaryContainer,
      selectedBorder: c.primary,
      selectedText: c.onPrimaryContainer,
    },
    divider: { subtle: c.outlineVariant },
    space: {
      xs: 6,
      sm: 12,
      md: 16,
      lg: 24,
    },
    radius: {
      sm: 10,
      md: 14,
      lg: 18,
      pill: 999,
    },
  };
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme();
  const isMounted = useIsMounted();

  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    (async () => {
      const saved = await loadThemeMode();
      if (saved && isMounted.current) setModeState(saved);
    })().catch((err) => {
      // Non-fatal: fall back to "system"
      if (__DEV__) console.warn("Failed to load theme mode", err);
    });
  }, [isMounted]);

  const setMode = (next: ThemeMode) => {
    setModeState(next);

    saveThemeMode(next).catch((err) => {
      // Non-fatal: UI state already updated; persistence failed.
      if (__DEV__) console.warn("Failed to save theme mode", err);
    });
  };

  const value = useMemo<AppThemeContextValue>(() => {
    const resolved = resolveMode(mode, system);
    const theme = resolved === "dark" ? MD3DarkTheme : MD3LightTheme;
    const tokens = buildTokens(theme);
    return { mode, setMode, theme, tokens };
  }, [mode, system]);

  return (
    <AppThemeContext.Provider value={value}>
      <PaperProvider theme={value.theme}>{children}</PaperProvider>
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within AppThemeProvider");
  return ctx;
}
