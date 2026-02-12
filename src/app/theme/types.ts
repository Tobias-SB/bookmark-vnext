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
  divider: {
    subtle: string;
  };
};
