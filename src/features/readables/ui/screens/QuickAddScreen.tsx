// src/features/readables/ui/screens/QuickAddScreen.tsx
import { useMemo, useState } from "react";
import { View } from "react-native";

import { useRootNavigation } from "@/app/navigation";
import { useAppTheme } from "@/app/theme";
import {
  AppButton,
  AppChip,
  AppDivider,
  AppScreen,
  AppSpacer,
  AppText,
  AppTextInput,
} from "@/shared/ui";

import { useAo3Prefill } from "../../metadata";

type Mode = "fanfic" | "book";

export function QuickAddScreen() {
  const navigation = useRootNavigation();
  const { tokens } = useAppTheme();

  const [mode, setMode] = useState<Mode>("fanfic");
  const [ao3Url, setAo3Url] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");

  const [error, setError] = useState<string | null>(null);

  const ao3Prefill = useAo3Prefill();

  const canContinue = useMemo(() => {
    if (mode === "fanfic") return ao3Url.trim().length > 0;
    return bookTitle.trim().length > 0;
  }, [mode, ao3Url, bookTitle]);

  async function onContinue() {
    setError(null);

    if (mode === "fanfic") {
      const url = ao3Url.trim();

      if (!url) {
        setError("Paste an AO3 URL to continue.");
        return;
      }

      try {
        const prefill = await ao3Prefill.mutateAsync(url);
        navigation.navigate("ReadableUpsert", { prefill });
        return;
      } catch (e) {
        // Fallback: still land in the full form with whatever we have.
        const message =
          e instanceof Error ? e.message : "Couldn’t fetch details.";
        setError(message);

        navigation.navigate("ReadableUpsert", {
          prefill: {
            kind: "fanfic",
            sourceUrl: url,
            title: "",
            author: null,
            isComplete: false,
            status: "to-read",
            progressCurrent: 0,
            progressTotal: null,
          },
        });
        return;
      }
    }

    const title = bookTitle.trim();
    if (!title) {
      setError("Enter at least a title to continue.");
      return;
    }

    navigation.navigate("ReadableUpsert", {
      prefill: {
        kind: "book",
        title,
        author: bookAuthor.trim() || null,
        status: "to-read",
        progressCurrent: 0,
        progressTotal: null,
      },
    });
  }

  return (
    <AppScreen padded>
      <AppText variant="title">Quick Add</AppText>
      <AppSpacer size={8} />

      <AppText variant="secondary">
        Quick Add prefills the full form. Nothing is saved until you tap Save.
      </AppText>

      <AppSpacer size={16} />
      <View style={{ flexDirection: "row", gap: tokens.space.sm }}>
        <AppChip
          label="Fanfic (AO3 URL)"
          selected={mode === "fanfic"}
          onPress={() => setMode("fanfic")}
        />
        <AppChip
          label="Book (title/author)"
          selected={mode === "book"}
          onPress={() => setMode("book")}
        />
      </View>

      <AppSpacer size={16} />
      <AppDivider />
      <AppSpacer size={16} />

      {mode === "fanfic" ? (
        <>
          <AppText variant="secondary">AO3 URL</AppText>
          <AppSpacer size={8} />
          <AppTextInput
            value={ao3Url}
            onChangeText={setAo3Url}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            placeholder="https://archiveofourown.org/works/123456"
          />

          <AppSpacer size={12} />
          <AppText variant="secondary">
            We’ll try to prefill what we can. If anything’s missing (or fetch
            fails), you’ll still land on the full form.
          </AppText>
        </>
      ) : (
        <>
          <AppText variant="secondary">Title</AppText>
          <AppSpacer size={8} />
          <AppTextInput value={bookTitle} onChangeText={setBookTitle} />

          <AppSpacer size={12} />
          <AppText variant="secondary">Author (optional)</AppText>
          <AppSpacer size={8} />
          <AppTextInput value={bookAuthor} onChangeText={setBookAuthor} />
        </>
      )}

      {error ? (
        <>
          <AppSpacer size={12} />
          <AppText variant="secondary">{error}</AppText>
        </>
      ) : null}

      <AppSpacer size={20} />
      <AppButton
        mode="contained"
        disabled={!canContinue || ao3Prefill.isPending}
        loading={ao3Prefill.isPending}
        onPress={onContinue}
      >
        Continue to Full Add
      </AppButton>

      <AppSpacer size={10} />
      <AppButton mode="text" onPress={() => navigation.goBack()}>
        Cancel
      </AppButton>
    </AppScreen>
  );
}
