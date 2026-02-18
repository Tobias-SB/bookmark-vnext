// src/features/readables/metadata/ao3Prefill.ts
import type { ReadableStatus } from "../domain";

export type ReadableUpsertPrefill = {
  kind: "fanfic";
  title?: string;
  author?: string | null;
  sourceUrl: string;
  isComplete?: boolean;
  status?: ReadableStatus;
  progressCurrent?: number;
  progressTotal?: number | null;
};

function normalizeUrl(raw: string): string {
  return raw.trim();
}

function isAo3Url(url: string): boolean {
  return /https?:\/\/(www\.)?archiveofourown\.org\//i.test(url);
}

function tryExtractAo3WorkId(url: string): string | null {
  const m = url.match(/\/works\/(\d+)/i);
  return m?.[1] ?? null;
}

/**
 * v1: local, non-network prefill.
 *
 * Later, this can call an AO3 metadata service (httpClient → ao3Api → service).
 * This stays an explicit user action (Quick Add "Fetch").
 */
export async function ao3PrefillFromUrl(
  rawUrl: string,
): Promise<ReadableUpsertPrefill> {
  const url = normalizeUrl(rawUrl);

  if (!url) {
    throw new Error("Please paste an AO3 URL.");
  }

  if (!isAo3Url(url)) {
    throw new Error("That doesn’t look like an AO3 URL.");
  }

  const workId = tryExtractAo3WorkId(url);
  const title = workId ? `AO3 Work ${workId}` : undefined;

  return {
    kind: "fanfic",
    title,
    author: null,
    sourceUrl: url,
    isComplete: false,
    status: "to-read",
    progressCurrent: 0,
    progressTotal: null,
  };
}
