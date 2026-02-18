// src/features/readables/ui/screens/ReadableListScreen.tsx
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import { useLibraryNavigation } from "@/app/navigation";
import { useAppTheme } from "@/app/theme";
import { AppButton, AppScreen, AppSpacer, AppText } from "@/shared/ui";
import { createId } from "@/shared/utils";
import { useReadables, useUpsertReadable } from "../../data";

export function ReadableListScreen() {
  const navigation = useLibraryNavigation();
  const { tokens } = useAppTheme();

  const { data, isLoading, isError } = useReadables();
  const upsert = useUpsertReadable();

  const items = data ?? [];

  return (
    <AppScreen padded>
      <View style={[styles.headerRow, { gap: tokens.space.sm }]}>
        <AppText variant="title">Library</AppText>
        <AppButton
          mode="outlined"
          onPress={() => navigation.navigate("AddChooser")}
        >
          Add
        </AppButton>
      </View>

      <AppSpacer size={12} />

      {isLoading ? (
        <AppText variant="secondary">Loading…</AppText>
      ) : isError ? (
        <AppText variant="secondary">Couldn’t load your library.</AppText>
      ) : items.length === 0 ? (
        <>
          <AppText>No items yet.</AppText>
          <AppSpacer size={8} />
          <AppText variant="secondary">
            Add a book or fanfic to start tracking status and progress.
          </AppText>

          <AppSpacer size={16} />
          <AppButton
            mode="contained"
            onPress={() => navigation.navigate("AddChooser")}
          >
            Add your first item
          </AppButton>

          {__DEV__ ? (
            <>
              <AppSpacer size={24} />
              <AppText variant="secondary">Dev tools</AppText>
              <AppSpacer size={8} />

              <AppButton
                mode="outlined"
                onPress={() =>
                  upsert.mutate({
                    id: createId(),
                    kind: "book",
                    title: "Demo Book",
                    author: "Author McAuthorface",
                    status: "reading",
                    progressCurrent: 12,
                    progressTotal: 300,
                  })
                }
              >
                Insert demo book
              </AppButton>

              <AppSpacer size={8} />

              <AppButton
                mode="outlined"
                onPress={() =>
                  upsert.mutate({
                    id: createId(),
                    kind: "fanfic",
                    title: "Demo Fanfic",
                    author: "AO3 Wizard",
                    sourceUrl: "https://archiveofourown.org/",
                    isComplete: false,
                    status: "to-read",
                    progressCurrent: 0,
                    progressTotal: 42,
                  })
                }
              >
                Insert demo fanfic
              </AppButton>
            </>
          ) : null}
        </>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          ItemSeparatorComponent={() => <AppSpacer size={10} />}
          renderItem={({ item }) => {
            const subtitle =
              item.author ?? (item.kind === "fanfic" ? "Fanfic" : "Book");

            const progress =
              item.progressTotal === null
                ? `${item.progressCurrent} ${item.progressUnit}`
                : `${item.progressCurrent}/${item.progressTotal} ${item.progressUnit}`;

            const extra =
              item.kind === "fanfic"
                ? item.isComplete
                  ? "complete"
                  : "WIP"
                : null;

            return (
              <Pressable
                onPress={() =>
                  navigation.navigate("ReadableDetail", { id: item.id })
                }
                style={[
                  styles.row,
                  {
                    backgroundColor: tokens.card.background,
                    borderColor: tokens.card.border,
                    borderRadius: tokens.radius.md,
                    padding: tokens.space.md,
                  },
                ]}
              >
                <View>
                  <AppText>{item.title}</AppText>
                  <AppSpacer size={4} />
                  <AppText variant="secondary">{subtitle}</AppText>
                  <AppSpacer size={4} />
                  <AppText variant="secondary">
                    {item.status} • {progress}
                    {extra ? ` • ${extra}` : ""}
                  </AppText>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
