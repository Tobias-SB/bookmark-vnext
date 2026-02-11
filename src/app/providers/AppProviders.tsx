import { PropsWithChildren } from "react";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/app/config/queryClient";
import { AppThemeProvider, useAppThemeMode } from "@/app/theme";

function ThemedProviders({ children }: PropsWithChildren) {
  const { theme } = useAppThemeMode();

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
        <ThemedProviders>{children}</ThemedProviders>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
