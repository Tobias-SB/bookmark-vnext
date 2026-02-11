import { StyleSheet, View } from "react-native";
import { useNavigation, type NavigationProp } from "@react-navigation/native";

import type { RootStackParamList } from "@/app/navigation";
import { AppButton, AppScreen, AppText } from "@/shared/ui";

export function ReadableListScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const demoId = "demo-readable-id";

  return (
    <AppScreen>
      <AppText variant="title">Library</AppText>
      <View style={styles.spacer} />

      <AppText>
        Phase 1 scaffold is live. Next: SQLite + repos + real list rendering.
      </AppText>

      <View style={styles.spacer} />

      <AppButton
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
