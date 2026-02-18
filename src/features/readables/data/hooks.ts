// src/features/readables/data/hooks.ts
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";

import type {
  ReadableProgressPatch,
  ReadableStatus,
  ReadableUpsertPayload,
} from "../domain";
import { readablesKeys } from "./queryKeys";
import { createReadablesRepository } from "./repository";

function useReadablesRepo() {
  const db = useSQLiteContext();
  return useMemo(() => createReadablesRepository(db), [db]);
}

export function useReadables() {
  const repo = useReadablesRepo();
  return useQuery({
    queryKey: readablesKeys.list(),
    queryFn: () => repo.list(),
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
      await qc.invalidateQueries({ queryKey: readablesKeys.list() });
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
      await qc.invalidateQueries({ queryKey: readablesKeys.list() });
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
      await qc.invalidateQueries({ queryKey: readablesKeys.list() });
      await qc.invalidateQueries({ queryKey: readablesKeys.detail(vars.id) });
    },
  });
}
