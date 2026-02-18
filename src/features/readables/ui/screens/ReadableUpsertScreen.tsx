// src/features/readables/ui/screens/ReadableUpsertScreen.tsx
import { useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

import type { RootStackParamList } from "@/app/navigation";
import { useRootNavigation } from "@/app/navigation";
import { useAppTheme } from "@/app/theme";
import { useIsMounted } from "@/shared/hooks";
import {
  AppButton,
  AppChip,
  AppDivider,
  AppScreen,
  AppSpacer,
  AppText,
  AppTextInput,
} from "@/shared/ui";
import { createId } from "@/shared/utils";

import {
  READABLE_STATUSES,
  type ReadableKind,
  type ReadableStatus,
} from "../../domain";
import { useReadable, useUpsertReadable } from "../../data";

type R = RouteProp<RootStackParamList, "ReadableUpsert">;
type UpsertParams = NonNullable<RootStackParamList["ReadableUpsert"]>;
type Prefill = UpsertParams["prefill"];

const StatusSchema = z.enum(["to-read", "reading", "finished", "dnf"]);
const KindSchema = z.enum(["book", "fanfic"]);

function parseOptionalNonNegativeInt(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return null;
  const int = Math.trunc(n);
  if (int < 0) return null;
  return int;
}

const FormSchema = z
  .object({
    kind: KindSchema,
    title: z.string().trim().min(1, "Title is required"),
    author: z.string().trim().optional(),
    sourceUrl: z.string().trim().optional(),
    isComplete: z.boolean(),
    status: StatusSchema,
    progressCurrent: z.string(),
    progressTotal: z.string(),
  })
  .superRefine((val, ctx) => {
    const currentRaw = parseOptionalNonNegativeInt(val.progressCurrent);
    const current = currentRaw ?? 0;

    const totalRaw = parseOptionalNonNegativeInt(val.progressTotal);
    const total = totalRaw;

    if (currentRaw === null && val.progressCurrent.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["progressCurrent"],
        message: "Progress must be a non-negative number.",
      });
    }

    if (val.progressTotal.trim() && total === null) {
      ctx.addIssue({
        code: "custom",
        path: ["progressTotal"],
        message: "Total must be a non-negative number.",
      });
    }

    if (total !== null && current > total) {
      ctx.addIssue({
        code: "custom",
        path: ["progressCurrent"],
        message: "Progress can’t be greater than total.",
      });
    }
  });

type FormValues = z.infer<typeof FormSchema>;

const resolver: Resolver<FormValues> = async (values) => {
  const parsed = FormSchema.safeParse(values);

  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  const errors = parsed.error.issues.reduce<
    Record<string, { type: string; message: string }>
  >((acc, issue) => {
    const key = issue.path[0];
    if (!key) return acc;

    acc[String(key)] = {
      type: issue.code,
      message: issue.message,
    };
    return acc;
  }, {});

  return { values: {}, errors };
};

function mapPrefillToDefaults(prefill?: Prefill): Partial<FormValues> {
  if (!prefill) return {};

  const kind = prefill.kind ?? "book";

  return {
    kind,
    title: prefill.title ?? "",
    author: prefill.author ?? "",
    sourceUrl: kind === "fanfic" ? (prefill.sourceUrl ?? "") : "",
    isComplete: kind === "fanfic" ? (prefill.isComplete ?? false) : false,
    status: (prefill.status ?? "to-read") as ReadableStatus,
    progressCurrent:
      prefill.progressCurrent === undefined
        ? "0"
        : String(prefill.progressCurrent),
    progressTotal:
      prefill.progressTotal === undefined || prefill.progressTotal === null
        ? ""
        : String(prefill.progressTotal),
  };
}

export function ReadableUpsertScreen() {
  const route = useRoute<R>();
  const navigation = useRootNavigation();
  const { tokens } = useAppTheme();
  const isMounted = useIsMounted();

  const params = route.params;
  const id = params?.id;
  const isEdit = Boolean(id);

  const existing = useReadable(id ?? "");
  const upsert = useUpsertReadable();

  const initialDefaults = useMemo<FormValues>(() => {
    const prefillDefaults = mapPrefillToDefaults(params?.prefill);

    return {
      kind: (prefillDefaults.kind ?? "book") as ReadableKind,
      title: prefillDefaults.title ?? "",
      author: prefillDefaults.author ?? "",
      sourceUrl: prefillDefaults.sourceUrl ?? "",
      isComplete: prefillDefaults.isComplete ?? false,
      status: (prefillDefaults.status ?? "to-read") as ReadableStatus,
      progressCurrent: prefillDefaults.progressCurrent ?? "0",
      progressTotal: prefillDefaults.progressTotal ?? "",
    };
  }, [params?.prefill]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver,
    defaultValues: initialDefaults,
  });

  const kind = watch("kind");

  useEffect(() => {
    if (!isEdit) return;
    if (existing.isLoading) return;
    if (!existing.data) return;

    const data = existing.data;

    const next: FormValues = {
      kind: data.kind,
      title: data.title,
      author: data.author ?? "",
      sourceUrl: data.kind === "fanfic" ? (data.sourceUrl ?? "") : "",
      isComplete: data.kind === "fanfic" ? data.isComplete : false,
      status: data.status,
      progressCurrent: String(data.progressCurrent),
      progressTotal:
        data.progressTotal === null ? "" : String(data.progressTotal),
    };

    if (isMounted.current) reset(next);
  }, [isEdit, existing.isLoading, existing.data, reset, isMounted]);

  const title = isEdit ? "Edit" : "Full Add";

  const onSubmit = handleSubmit(async (values) => {
    const newId = id ?? createId();

    const progressCurrent =
      parseOptionalNonNegativeInt(values.progressCurrent) ?? 0;
    const progressTotal = parseOptionalNonNegativeInt(values.progressTotal);

    if (values.kind === "book") {
      await upsert.mutateAsync({
        id: newId,
        kind: "book",
        title: values.title.trim(),
        author: values.author?.trim() ? values.author.trim() : null,
        status: values.status,
        progressCurrent,
        progressTotal,
      });

      navigation.replace("ReadableDetail", { id: newId });
      return;
    }

    await upsert.mutateAsync({
      id: newId,
      kind: "fanfic",
      title: values.title.trim(),
      author: values.author?.trim() ? values.author.trim() : null,
      sourceUrl: values.sourceUrl?.trim() ? values.sourceUrl.trim() : null,
      isComplete: values.isComplete,
      status: values.status,
      progressCurrent,
      progressTotal,
    });

    navigation.replace("ReadableDetail", { id: newId });
  });

  return (
    <AppScreen padded>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppText variant="title">{title}</AppText>
        <AppSpacer size={8} />
        <AppText variant="secondary">
          {isEdit
            ? "Update the details for this item."
            : "Enter details manually. Quick Add can prefill this screen, but nothing is saved until you tap Save."}
        </AppText>

        <AppSpacer size={16} />
        <AppDivider />
        <AppSpacer size={16} />

        <AppText variant="secondary">Kind</AppText>
        <AppSpacer size={8} />
        <Controller
          control={control}
          name="kind"
          render={({ field: { value, onChange } }) => (
            <View style={{ flexDirection: "row", gap: tokens.space.sm }}>
              <AppChip
                label="Book"
                selected={value === "book"}
                onPress={() => onChange("book")}
              />
              <AppChip
                label="Fanfic"
                selected={value === "fanfic"}
                onPress={() => onChange("fanfic")}
              />
            </View>
          )}
        />

        <AppSpacer size={16} />

        <AppText variant="secondary">Title</AppText>
        <AppSpacer size={8} />
        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange } }) => (
            <AppTextInput value={value} onChangeText={onChange} />
          )}
        />
        {errors.title ? (
          <>
            <AppSpacer size={6} />
            <AppText variant="secondary">{errors.title.message}</AppText>
          </>
        ) : null}

        <AppSpacer size={16} />
        <AppText variant="secondary">Author (optional)</AppText>
        <AppSpacer size={8} />
        <Controller
          control={control}
          name="author"
          render={({ field: { value, onChange } }) => (
            <AppTextInput value={value ?? ""} onChangeText={onChange} />
          )}
        />

        {kind === "fanfic" ? (
          <>
            <AppSpacer size={16} />
            <AppText variant="secondary">AO3 URL (optional)</AppText>
            <AppSpacer size={8} />
            <Controller
              control={control}
              name="sourceUrl"
              render={({ field: { value, onChange } }) => (
                <AppTextInput
                  value={value ?? ""}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  placeholder="https://archiveofourown.org/works/123456"
                />
              )}
            />

            <AppSpacer size={12} />
            <AppText variant="secondary">Completion</AppText>
            <AppSpacer size={8} />
            <Controller
              control={control}
              name="isComplete"
              render={({ field: { value, onChange } }) => (
                <View style={{ flexDirection: "row", gap: tokens.space.sm }}>
                  <AppChip
                    label="WIP"
                    selected={!value}
                    onPress={() => onChange(false)}
                  />
                  <AppChip
                    label="Complete"
                    selected={value}
                    onPress={() => onChange(true)}
                  />
                </View>
              )}
            />
          </>
        ) : null}

        <AppSpacer size={16} />
        <AppDivider />
        <AppSpacer size={16} />

        <AppText variant="secondary">Status</AppText>
        <AppSpacer size={8} />
        <Controller
          control={control}
          name="status"
          render={({ field: { value, onChange } }) => (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: tokens.space.sm,
              }}
            >
              {READABLE_STATUSES.map((s) => (
                <AppChip
                  key={s}
                  label={s}
                  selected={value === s}
                  onPress={() => onChange(s)}
                />
              ))}
            </View>
          )}
        />

        <AppSpacer size={16} />
        <AppText variant="secondary">Progress</AppText>
        <AppSpacer size={8} />

        <AppText variant="secondary">Current</AppText>
        <AppSpacer size={8} />
        <Controller
          control={control}
          name="progressCurrent"
          render={({ field: { value, onChange } }) => (
            <AppTextInput
              value={value}
              onChangeText={onChange}
              keyboardType="number-pad"
            />
          )}
        />
        {errors.progressCurrent ? (
          <>
            <AppSpacer size={6} />
            <AppText variant="secondary">
              {errors.progressCurrent.message}
            </AppText>
          </>
        ) : null}

        <AppSpacer size={12} />
        <AppText variant="secondary">Total (optional)</AppText>
        <AppSpacer size={8} />
        <Controller
          control={control}
          name="progressTotal"
          render={({ field: { value, onChange } }) => (
            <AppTextInput
              value={value}
              onChangeText={onChange}
              keyboardType="number-pad"
            />
          )}
        />
        {errors.progressTotal ? (
          <>
            <AppSpacer size={6} />
            <AppText variant="secondary">
              {errors.progressTotal.message}
            </AppText>
          </>
        ) : null}

        {upsert.error ? (
          <>
            <AppSpacer size={12} />
            <AppText variant="secondary">
              {upsert.error instanceof Error
                ? upsert.error.message
                : "Couldn’t save. Try again."}
            </AppText>
          </>
        ) : null}

        <AppSpacer size={20} />
        <AppButton
          mode="contained"
          loading={upsert.isPending || isSubmitting}
          disabled={
            upsert.isPending || isSubmitting || (isEdit && existing.isLoading)
          }
          onPress={onSubmit}
        >
          Save
        </AppButton>

        <AppSpacer size={10} />
        <AppButton mode="text" onPress={() => navigation.goBack()}>
          Cancel
        </AppButton>

        <AppSpacer size={30} />
      </ScrollView>
    </AppScreen>
  );
}
