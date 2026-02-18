import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { SQLiteProvider } from "expo-sqlite";
import { PropsWithChildren, useState } from "react";

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
  const [error, setError] = useState<string | null>(null);

  return (
    <SQLiteProvider
      databaseName={DATABASE_NAME}
      onInit={async (db) => {
        try {
          await migrateDbIfNeeded(db);
          setReady(true);
        } catch (e) {
          // Surfacing the actual error message makes Android SQLite failures *far*
          // less mysterious than “NativeDatabase.* has been rejected”.
          console.error("Database init failed", e);
          setError(e instanceof Error ? e.message : String(e));
        }
      }}
    >
      {error ? (
        <AppScreen padded>
          <AppText variant="title">Database error</AppText>
          <AppSpacer size={8} />
          <AppText variant="secondary">{error}</AppText>
          <AppSpacer size={16} />
          <AppText variant="secondary">
            Tip: if this happened right after a schema change, try deleting the
            app data (or uninstalling) to reset the local database.
          </AppText>
        </AppScreen>
      ) : ready ? (
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
