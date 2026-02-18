// src/features/readables/metadata/useAo3Prefill.ts
import { useMutation } from "@tanstack/react-query";
import { ao3PrefillFromUrl, type ReadableUpsertPrefill } from "./ao3Prefill";

export function useAo3Prefill() {
  return useMutation({
    mutationFn: (url: string) => ao3PrefillFromUrl(url),
  });
}

export type { ReadableUpsertPrefill };
