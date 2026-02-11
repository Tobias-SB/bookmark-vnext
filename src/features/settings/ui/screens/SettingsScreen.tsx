import { StyleSheet, View } from "react-native";

import { useAppTheme } from "@/app/theme";
import { AppButton, AppScreen, AppText } from "@/shared/ui";

export function SettingsScreen() {
  const { mode, setMode } = useAppTheme();

  return (
    <AppScreen>
      <AppText variant="title">Settings</AppText>
      <View style={styles.spacer} />

      <AppText variant="secondary">Theme mode: {mode}</AppText>
      <View style={styles.spacer} />

      <View style={styles.row}>
        <AppButton
          mode={mode === "system" ? "contained" : "outlined"}
          onPress={() => setMode("system")}
        >
          System
        </AppButton>
        <AppButton
          mode={mode === "light" ? "contained" : "outlined"}
          onPress={() => setMode("light")}
        >
          Light
        </AppButton>
        <AppButton
          mode={mode === "dark" ? "contained" : "outlined"}
          onPress={() => setMode("dark")}
        >
          Dark
        </AppButton>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  spacer: { height: 12 },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
});
