import { PropsWithChildren, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { SQLiteProvider } from "expo-sqlite";

import { queryClient } from "@/app/config/queryClient";
import { DATABASE_NAME, migrateDbIfNeeded } from "@/app/db";
import { AppThemeProvider, useAppTheme } from "@/app/theme";
import { buildNavigationTheme } from "@/app/theme/buildNavigationTheme";
import { AppScreen, AppSpacer, AppText } from "@/shared/ui";

function NavigationWithTheme({ children }: PropsWithChildren) {
  const { theme } = useAppTheme();
  const navTheme = buildNavigationTheme(theme);

  return <NavigationContainer theme={navTheme}>{children}</NavigationContainer>;
}

function DatabaseProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);

  return (
    <SQLiteProvider
      databaseName={DATABASE_NAME}
      onInit={async (db) => {
        await migrateDbIfNeeded(db);
        setReady(true);
      }}
    >
      {ready ? (
        children
      ) : (
        <AppScreen padded>
          <AppText variant="title">Preparing database…</AppText>
          <AppSpacer size={8} />
          <AppText variant="secondary">
            Running migrations before the app renders.
          </AppText>
        </AppScreen>
      )}
    </SQLiteProvider>
  );
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AppThemeProvider>
      <QueryClientProvider client={queryClient}>
        <DatabaseProvider>
          <NavigationWithTheme>{children}</NavigationWithTheme>
        </DatabaseProvider>
      </QueryClientProvider>
    </AppThemeProvider>
  );
}
