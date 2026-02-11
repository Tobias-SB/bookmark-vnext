import { AppProviders } from "@/app/providers/AppProviders";
import { RootNavigator } from "@/app/navigation";

export function AppEntry() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
