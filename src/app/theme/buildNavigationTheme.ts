// src/app/theme/buildNavigationTheme.ts
import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";
import type { MD3Theme } from "react-native-paper";

export function buildNavigationTheme(paperTheme: MD3Theme): Theme {
  const base = paperTheme.dark ? DarkTheme : DefaultTheme;
  const c = paperTheme.colors;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.primary,
      background: c.background,
      card: c.surface,
      text: c.onSurface,
      border: c.outlineVariant,
      notification: c.primary,
    },
  };
}
