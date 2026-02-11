import { AppButton, AppScreen, AppSpacer, AppText } from "@/shared/ui";
import { useLibraryNavigation } from "@/app/navigation";

export function ReadableListScreen() {
  const navigation = useLibraryNavigation();
  const demoId = "demo-readable-id";

  return (
    <AppScreen>
      <AppText variant="title">Library</AppText>
      <AppSpacer />

      <AppText>
        Phase 1 scaffold is live. Next: SQLite + repos + real list rendering.
      </AppText>
      <AppSpacer />

      <AppButton
        onPress={() => navigation.navigate("ReadableDetail", { id: demoId })}
      >
        Open demo detail
      </AppButton>
    </AppScreen>
  );
}
