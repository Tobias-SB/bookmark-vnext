import { StyleSheet, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";

import type { RootStackParamList } from "@/app/navigation";
import { AppScreen, AppText } from "@/shared/ui";

type R = RouteProp<RootStackParamList, "ReadableDetail">;

export function ReadableDetailScreen() {
  const route = useRoute<R>();

  return (
    <AppScreen>
      <AppText variant="title">Readable Detail</AppText>
      <View style={styles.spacer} />
      <AppText variant="secondary">id: {route.params.id}</AppText>
      <View style={styles.spacer} />
      <AppText>
        Phase 4 will replace this with status + progress controls and the AO3
        button for fanfics.
      </AppText>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  spacer: { height: 12 },
});
