import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { MainTabsParamList, RootStackParamList } from "@/app/navigation";
import { AppButton, AppScreen, AppText } from "@/shared/ui";

type NavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList, "Library">,
  NativeStackNavigationProp<RootStackParamList>
>;

export function ReadableListScreen() {
  const navigation = useNavigation<NavProp>();

  const demoId = useMemo(() => "demo-readable-id", []);

  return (
    <AppScreen>
      <AppText variant="title">Library</AppText>
      <View style={styles.spacer} />

      <AppText>
        Phase 1 scaffold is live. Next: data layer (SQLite + repos) and real
        list rendering.
      </AppText>

      <View style={styles.spacer} />

      <AppButton
        mode="contained"
        onPress={() => navigation.navigate("ReadableDetail", { id: demoId })}
      >
        Open demo detail
      </AppButton>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  spacer: { height: 12 },
});
