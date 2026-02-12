import { PropsWithChildren } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/app/config/queryClient";
import { AppThemeProvider, useAppTheme } from "@/app/theme";
import { buildNavigationTheme } from "@/app/theme/buildNavigationTheme";

function NavigationWithTheme({ children }: PropsWithChildren) {
  const { theme } = useAppTheme();
  const navTheme = buildNavigationTheme(theme);

  return <NavigationContainer theme={navTheme}>{children}</NavigationContainer>;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <NavigationWithTheme>{children}</NavigationWithTheme>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
