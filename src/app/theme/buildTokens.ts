import type { MD3Theme } from "react-native-paper";
import type { ThemeTokens } from "@/app/theme/types";

export function buildTokens(theme: MD3Theme): ThemeTokens {
  const c = theme.colors;

  return {
    screen: {
      background: c.background,
    },
    text: {
      primary: c.onBackground,
      secondary: c.onSurfaceVariant,
    },
    card: {
      background: c.surface,
      border: c.outlineVariant,
    },
    button: {
      primaryBackground: c.primary,
      primaryText: c.onPrimary,
    },
    divider: {
      subtle: c.outlineVariant,
    },
  };
}
