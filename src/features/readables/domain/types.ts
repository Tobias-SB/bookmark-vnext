// src/features/readables/domain/types.ts
import type {
  READABLE_KINDS,
  READABLE_STATUSES,
  PROGRESS_UNITS,
} from "./constants";

export type ReadableKind = (typeof READABLE_KINDS)[number];
export type ReadableStatus = (typeof READABLE_STATUSES)[number];
export type ProgressUnit = (typeof PROGRESS_UNITS)[number];

type ReadableItemBase = {
  id: string;
  title: string;
  author: string | null;

  status: ReadableStatus;

  progressCurrent: number;
  progressTotal: number | null;

  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type BookReadableItem = ReadableItemBase & {
  kind: "book";
  progressUnit: "pages";
  sourceUrl: null;
  isComplete: null;
};

export type FanficReadableItem = ReadableItemBase & {
  kind: "fanfic";
  progressUnit: "chapters";
  sourceUrl: string | null;
  isComplete: boolean;
};

export type ReadableItem = BookReadableItem | FanficReadableItem;

export type ReadableUpsertPayload =
  | {
      id: string;
      kind: "book";
      title: string;
      author?: string | null;
      status?: ReadableStatus;
      progressCurrent?: number;
      progressTotal?: number | null;
    }
  | {
      id: string;
      kind: "fanfic";
      title: string;
      author?: string | null;
      sourceUrl?: string | null;
      isComplete?: boolean;
      status?: ReadableStatus;
      progressCurrent?: number;
      progressTotal?: number | null;
    };

export type ReadableProgressPatch = {
  progressCurrent?: number;
  progressTotal?: number | null;
};

export type ReadablesCompletionFilter = "all" | "wip" | "complete";
export type ReadablesSort = "recent" | "title";

export type ReadablesListQuery = {
  /** Case-insensitive substring match against title + author. */
  search?: string;
  /** When omitted, all statuses are included. */
  status?: ReadableStatus;
  /**
   * Fanfic-only completion filter.
   * Books are never excluded by this filter.
   */
  completion?: ReadablesCompletionFilter;
  /** Minimal sort for v1. */
  sort?: ReadablesSort;
};
