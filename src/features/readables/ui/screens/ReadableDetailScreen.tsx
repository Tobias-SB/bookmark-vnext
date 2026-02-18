// src/features/readables/ui/screens/ReadableDetailScreen.tsx
import { Linking, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";

import type { RootStackParamList } from "@/app/navigation";
import { AppButton, AppScreen, AppSpacer, AppText } from "@/shared/ui";
import { useReadable } from "@/features/readables";

type R = RouteProp<RootStackParamList, "ReadableDetail">;

export function ReadableDetailScreen() {
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

      {ao3Url ? (
        <>
          <AppSpacer size={16} />
          <View>
            <AppButton
              mode="contained"
              onPress={() => {
                // `ao3Url` is guaranteed string here (truthy branch).
                void Linking.openURL(ao3Url);
              }}
            >
              View on AO3
            </AppButton>
          </View>
        </>
      ) : null}

      <AppSpacer size={20} />
      <AppText variant="secondary">
        Next: the Add flow + real edit controls for status/progress.
      </AppText>
    </AppScreen>
  );
}
