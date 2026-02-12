import { SegmentedButtons } from "react-native-paper";

import { useAppTheme } from "@/app/theme";
import { AppScreen, AppSpacer, AppText } from "@/shared/ui";

export function SettingsScreen() {
  const { mode, setMode } = useAppTheme();

  return (
    <AppScreen>
      <AppText variant="title">Settings</AppText>
      <AppSpacer />

      <AppText variant="secondary">Theme mode</AppText>
      <AppSpacer size={8} />

      <SegmentedButtons
        value={mode}
        onValueChange={(v) => setMode(v as typeof mode)}
        buttons={[
          { value: "system", label: "System" },
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
      />

      <AppSpacer />
      <AppText variant="secondary">
        (Saved automatically — survives app restarts.)
      </AppText>
    </AppScreen>
  );
}
