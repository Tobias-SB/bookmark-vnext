// src/features/readables/ui/screens/ReadableDetailScreen.tsx
import { Linking, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";

import type { RootStackParamList } from "@/app/navigation";
import { useRootNavigation } from "@/app/navigation";
import { useAppTheme } from "@/app/theme";
import { AppButton, AppScreen, AppSpacer, AppText } from "@/shared/ui";
import { useReadable } from "../../data";

type R = RouteProp<RootStackParamList, "ReadableDetail">;

export function ReadableDetailScreen() {
  const navigation = useRootNavigation();
  const { tokens } = useAppTheme();
  const route = useRoute<R>();
  const { data, isLoading, isError } = useReadable(route.params.id);

  if (isLoading) {
    return (
      <AppScreen padded>
        <AppText variant="secondary">Loading…</AppText>
      </AppScreen>
    );
  }

  if (isError) {
    return (
      <AppScreen padded>
        <AppText variant="secondary">Couldn’t load this item.</AppText>
      </AppScreen>
    );
  }

  if (!data) {
    return (
      <AppScreen padded>
        <AppText>Not found.</AppText>
        <AppSpacer size={8} />
        <AppText variant="secondary">id: {route.params.id}</AppText>
      </AppScreen>
    );
  }

  const subtitle = data.author ?? (data.kind === "fanfic" ? "Fanfic" : "Book");
  const ao3Url = data.kind === "fanfic" ? data.sourceUrl : null;

  return (
    <AppScreen padded>
      <AppText variant="title">{data.title}</AppText>
      <AppSpacer size={4} />
      <AppText variant="secondary">{subtitle}</AppText>

      <AppSpacer size={12} />

      <AppText variant="secondary">
        Status: {data.status}
        {" • "}
        Progress: {data.progressCurrent}
        {data.progressTotal !== null ? `/${data.progressTotal}` : ""}{" "}
        {data.progressUnit}
        {data.kind === "fanfic"
          ? data.isComplete
            ? " • complete"
            : " • WIP"
          : ""}
      </AppText>

      <AppSpacer size={16} />

      <View style={{ gap: tokens.space.sm }}>
        <AppButton
          mode="outlined"
          onPress={() => navigation.navigate("ReadableUpsert", { id: data.id })}
        >
          Edit
        </AppButton>

        {ao3Url ? (
          <AppButton
            mode="contained"
            onPress={() => {
              Linking.openURL(ao3Url).catch((err) => {
                if (__DEV__) console.warn("Failed to open AO3 URL", err);
              });
            }}
          >
            View on AO3
          </AppButton>
        ) : null}
      </View>

      <AppSpacer size={20} />
      <AppText variant="secondary">
        Next: add status/progress edit controls directly on this screen.
      </AppText>
    </AppScreen>
  );
}
