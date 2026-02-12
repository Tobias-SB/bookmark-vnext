import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";

import type { RootStackParamList } from "@/app/navigation";
import { AppScreen, AppSpacer, AppText } from "@/shared/ui";

type R = RouteProp<RootStackParamList, "ReadableDetail">;

export function ReadableDetailScreen() {
  const route = useRoute<R>();

  return (
    <AppScreen>
      <AppText variant="title">Readable Detail</AppText>
      <AppSpacer />
      <AppText variant="secondary">id: {route.params.id}</AppText>
      <AppSpacer />
      <AppText>
        Phase 4 will replace this with status + progress controls and the AO3
        button for fanfics.
      </AppText>
    </AppScreen>
  );
}
