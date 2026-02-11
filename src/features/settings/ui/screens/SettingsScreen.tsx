import { StyleSheet, View } from "react-native";

import { AppScreen, AppText } from "@/shared/ui";
import { useAppThemeMode } from "@/app/theme";

export function SettingsScreen() {
  const { mode, setMode } = useAppThemeMode();

  return (
    <AppScreen>
      <AppText variant="title">Settings</AppText>
      <View style={styles.spacer} />
      <AppText variant="secondary">Theme mode: {mode}</AppText>
      <View style={styles.spacer} />

      <AppText>
        Theme controls will live here in vNext. For now, this is the typed
        placeholder screen.
      </AppText>

      <View style={styles.spacer} />

      {/* Minimal, non-fancy controls for phase 1 */}
      <AppText onPress={() => setMode("system")}>• System</AppText>
      <AppText onPress={() => setMode("light")}>• Light</AppText>
      <AppText onPress={() => setMode("dark")}>• Dark</AppText>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  spacer: { height: 12 },
});
