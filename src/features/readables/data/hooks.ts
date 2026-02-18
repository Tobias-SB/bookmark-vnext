// src/features/readables/data/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

import type {
  ReadableProgressPatch,
  ReadableStatus,
  ReadableUpsertPayload,
  ReadablesListQuery,
} from "../domain";
import { readablesKeys, type ReadablesListKey } from "./queryKeys";
import { createReadablesRepository } from "./repository";

function useReadablesRepo() {
  const db = useSQLiteContext();
  return useMemo(() => createReadablesRepository(db), [db]);
}

function normalizeListKey(query?: ReadablesListQuery): {
  key: ReadablesListKey;
  repoQuery: ReadablesListQuery;
} {
  const search = query?.search?.trim() ?? "";
  const status = query?.status ?? "all";
  const completion = query?.completion ?? "all";
  const sort = query?.sort ?? "recent";

  const key: ReadablesListKey = { search, status, completion, sort };

  const repoQuery: ReadablesListQuery = {
    search: search || undefined,
    status: status === "all" ? undefined : status,
    completion,
    sort,
  };

  return { key, repoQuery };
}

export function useReadables(query?: ReadablesListQuery) {
  const repo = useReadablesRepo();

  const normalized = useMemo(
    () => normalizeListKey(query),
    [query?.search, query?.status, query?.completion, query?.sort],
  );

  return useQuery({
    queryKey: readablesKeys.list(normalized.key),
    queryFn: () => repo.list(normalized.repoQuery),
  });
}

export function useReadable(id: string) {
  const repo = useReadablesRepo();
  return useQuery({
    queryKey: readablesKeys.detail(id),
    queryFn: () => repo.getById(id),
    enabled: Boolean(id),
  });
}

export function useUpsertReadable() {
  const repo = useReadablesRepo();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReadableUpsertPayload) => repo.upsert(payload),
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: readablesKeys.all });
      await qc.invalidateQueries({ queryKey: readablesKeys.detail(vars.id) });
    },
  });
}

export function useUpdateReadableStatus() {
  const repo = useReadablesRepo();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (args: { id: string; status: ReadableStatus }) =>
      repo.updateStatus(args.id, args.status),
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: readablesKeys.all });
      await qc.invalidateQueries({ queryKey: readablesKeys.detail(vars.id) });
    },
  });
}

export function useUpdateReadableProgress() {
  const repo = useReadablesRepo();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (args: { id: string; patch: ReadableProgressPatch }) =>
      repo.updateProgress(args.id, args.patch),
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: readablesKeys.all });
      await qc.invalidateQueries({ queryKey: readablesKeys.detail(vars.id) });
    },
  });
}
