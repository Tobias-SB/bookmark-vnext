import type {
  ReadableStatus,
  ReadablesCompletionFilter,
  ReadablesSort,
} from "../domain";

export type ReadablesListKey = {
  search: string;
  status: ReadableStatus | "all";
  completion: ReadablesCompletionFilter;
  sort: ReadablesSort;
};

export const readablesKeys = {
  all: ["readables"] as const,
  list: (key: ReadablesListKey) => ["readables", "list", key] as const,
  detail: (id: string) => ["readables", "detail", id] as const,
};
