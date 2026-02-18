// src/app/navigation/types.ts
export type ReadableStatusParam = "to-read" | "reading" | "finished" | "dnf";
export type ReadableKindParam = "book" | "fanfic";

export type ReadableUpsertPrefillParam = {
  kind?: ReadableKindParam;
  title?: string;
  author?: string | null;
  sourceUrl?: string | null;
  isComplete?: boolean;
  status?: ReadableStatusParam;
  progressCurrent?: number;
  progressTotal?: number | null;
};

export type RootStackParamList = {
  MainTabs: undefined;
  ReadableDetail: { id: string };

  // Option A Add Flow:
  AddChooser: undefined;
  QuickAdd: undefined;
  ReadableUpsert:
    | { id?: string; prefill?: ReadableUpsertPrefillParam }
    | undefined;
};

export type MainTabsParamList = {
  Library: undefined;
  Settings: undefined;
  UIPlayground: undefined;
};
