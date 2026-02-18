// src/features/readables/data/repository.ts
import type { SQLiteDatabase } from "expo-sqlite";
import type {
  ProgressUnit,
  ReadableItem,
  ReadableKind,
  ReadableProgressPatch,
  ReadableStatus,
  ReadableUpsertPayload,
} from "@/features/readables/domain";

type ReadableRow = {
  id: string;

  kind: ReadableKind;
  title: string;
  author: string | null;
  source_url: string | null;

  status: ReadableStatus;

  progress_current: number;
  progress_total: number | null;
  progress_unit: ProgressUnit;

  is_complete: number | null;

  created_at: string;
  updated_at: string;
};

type StatusChangeEvent = { id: string; status: ReadableStatus; at: string };
type ProgressChangeEvent = {
  id: string;
  progressCurrent?: number;
  progressTotal?: number | null;
  at: string;
};

/**
 * Seam for history/stats later:
 * implement this to write to a `readable_events` table in the same transaction.
 */
export type ReadableEventSink = {
  recordStatusChange: (
    db: SQLiteDatabase,
    e: StatusChangeEvent,
  ) => Promise<void>;
  recordProgressChange: (
    db: SQLiteDatabase,
    e: ProgressChangeEvent,
  ) => Promise<void>;
};

const noopEventSink: ReadableEventSink = {
  recordStatusChange: async () => {},
  recordProgressChange: async () => {},
};

function progressUnitFor(kind: ReadableKind): ProgressUnit {
  return kind === "book" ? "pages" : "chapters";
}

function clampInt(n: unknown, fallback: number): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : fallback;
  return Math.max(0, Math.trunc(v));
}

function rowToDomain(row: ReadableRow): ReadableItem {
  if (row.kind === "book") {
    return {
      id: row.id,
      kind: "book",
      title: row.title,
      author: row.author,
      sourceUrl: null,
      status: row.status,
      progressCurrent: row.progress_current,
      progressTotal: row.progress_total,
      progressUnit: "pages",
      isComplete: null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  return {
    id: row.id,
    kind: "fanfic",
    title: row.title,
    author: row.author,
    sourceUrl: row.source_url,
    status: row.status,
    progressCurrent: row.progress_current,
    progressTotal: row.progress_total,
    progressUnit: "chapters",
    isComplete: row.is_complete === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createReadablesRepository(
  db: SQLiteDatabase,
  opts?: { eventSink?: ReadableEventSink },
) {
  const eventSink = opts?.eventSink ?? noopEventSink;

  async function list(): Promise<ReadableItem[]> {
    const rows = await db.getAllAsync<ReadableRow>(
      "SELECT * FROM readables ORDER BY updated_at DESC",
    );
    return rows.map(rowToDomain);
  }

  async function getById(id: string): Promise<ReadableItem | null> {
    const row = await db.getFirstAsync<ReadableRow>(
      "SELECT * FROM readables WHERE id = ?",
      [id],
    );
    return row ? rowToDomain(row) : null;
  }

  async function upsert(payload: ReadableUpsertPayload): Promise<void> {
    const now = new Date().toISOString();

    const title = payload.title.trim();
    const author = payload.author ?? null;

    const status: ReadableStatus = payload.status ?? "to-read";

    const progressCurrent = clampInt(payload.progressCurrent, 0);

    const progressTotalRaw =
      payload.progressTotal === undefined ? null : payload.progressTotal;
    const progressTotal =
      progressTotalRaw === null ? null : clampInt(progressTotalRaw, 0);

    const safeTotal =
      progressTotal === null ? null : Math.max(progressTotal, progressCurrent);

    const progressUnit = progressUnitFor(payload.kind);

    const sourceUrl =
      payload.kind === "fanfic" ? (payload.sourceUrl ?? null) : null;

    const isComplete =
      payload.kind === "fanfic"
        ? (payload.isComplete ?? false)
          ? 1
          : 0
        : null;

    await db.runAsync(
      `
      INSERT INTO readables (
        id, kind, title, author, source_url,
        status,
        progress_current, progress_total, progress_unit,
        is_complete,
        created_at, updated_at
      )
      VALUES (
        $id, $kind, $title, $author, $sourceUrl,
        $status,
        $progressCurrent, $progressTotal, $progressUnit,
        $isComplete,
        $createdAt, $updatedAt
      )
      ON CONFLICT(id) DO UPDATE SET
        kind = excluded.kind,
        title = excluded.title,
        author = excluded.author,
        source_url = excluded.source_url,
        status = excluded.status,
        progress_current = excluded.progress_current,
        progress_total = excluded.progress_total,
        progress_unit = excluded.progress_unit,
        is_complete = excluded.is_complete,
        updated_at = excluded.updated_at
      `,
      {
        $id: payload.id,
        $kind: payload.kind,
        $title: title,
        $author: author,
        $sourceUrl: sourceUrl,
        $status: status,
        $progressCurrent: progressCurrent,
        $progressTotal: safeTotal,
        $progressUnit: progressUnit,
        $isComplete: isComplete,
        $createdAt: now,
        $updatedAt: now,
      },
    );
  }

  async function updateStatus(
    id: string,
    status: ReadableStatus,
  ): Promise<void> {
    const now = new Date().toISOString();

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        "UPDATE readables SET status = ?, updated_at = ? WHERE id = ?",
        [status, now, id],
      );
      await eventSink.recordStatusChange(db, { id, status, at: now });
    });
  }

  async function updateProgress(
    id: string,
    patch: ReadableProgressPatch,
  ): Promise<void> {
    const now = new Date().toISOString();

    await db.withTransactionAsync(async () => {
      const existing = await getById(id);
      if (!existing) return;

      const nextCurrent =
        patch.progressCurrent === undefined
          ? existing.progressCurrent
          : clampInt(patch.progressCurrent, existing.progressCurrent);

      const nextTotalRaw =
        patch.progressTotal === undefined
          ? existing.progressTotal
          : patch.progressTotal;

      const nextTotal =
        nextTotalRaw === null
          ? null
          : clampInt(nextTotalRaw, existing.progressTotal ?? 0);

      const safeTotal =
        nextTotal === null ? null : Math.max(nextTotal, nextCurrent);

      await db.runAsync(
        `
        UPDATE readables
        SET progress_current = ?,
            progress_total = ?,
            updated_at = ?
        WHERE id = ?
        `,
        [nextCurrent, safeTotal, now, id],
      );

      await eventSink.recordProgressChange(db, {
        id,
        progressCurrent: nextCurrent,
        progressTotal: safeTotal,
        at: now,
      });
    });
  }

  return { list, getById, upsert, updateStatus, updateProgress };
}
