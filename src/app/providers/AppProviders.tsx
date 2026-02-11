import { PropsWithChildren } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";

import { queryClient } from "@/app/config/queryClient";
import { AppThemeProvider, useAppTheme } from "@/app/theme";

function ProvidersWithTheme({ children }: PropsWithChildren) {
  const { theme } = useAppTheme();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>{children}</NavigationContainer>
    </PaperProvider>
  );
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <ProvidersWithTheme>{children}</ProvidersWithTheme>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
