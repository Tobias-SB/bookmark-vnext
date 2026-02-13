// src/app/theme/types.ts
export type ThemeMode = "system" | "light" | "dark";

export type ThemeTokens = {
  screen: {
    background: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  card: {
    background: string;
    border: string;
  };
  button: {
    primaryBackground: string;
    primaryText: string;
  };
  chip: {
    background: string;
    border: string;
    text: string;
    selectedBackground: string;
    selectedBorder: string;
    selectedText: string;
  };
  divider: {
    subtle: string;
  };
  space: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    pill: number;
  };
};
