import { RootNavigator } from "@/app/navigation/navigators";
import { AppProviders } from "@/app/providers/AppProviders";

export default function App() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
