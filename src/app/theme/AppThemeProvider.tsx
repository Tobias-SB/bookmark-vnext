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

import type { ThemeMode, ThemeTokens } from "@/app/theme/types";
import { loadThemeMode, saveThemeMode } from "@/app/theme/storage";
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
    divider: { subtle: c.outlineVariant },
  };
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme();
  const isMounted = useIsMounted();

  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    void (async () => {
      const saved = await loadThemeMode();
      if (saved && isMounted.current) setModeState(saved);
    })();
  }, [isMounted]);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    void saveThemeMode(next);
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
