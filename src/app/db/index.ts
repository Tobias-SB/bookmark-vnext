// src/app/db/index.ts
import type { SQLiteDatabase } from "expo-sqlite";
import { migrateReadablesV1 } from "@/features/readables";

export const DATABASE_NAME = "bookmark.db";
const DATABASE_VERSION = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  let current = row?.user_version ?? 0;

  // Connection-level PRAGMAs should run on every app start.
  // (`journal_mode` in particular must run *outside* of a transaction.)
  await db.execAsync("PRAGMA foreign_keys = ON");

  if (current === 0) {
    await db.execAsync("PRAGMA journal_mode = WAL");
  }

  if (current >= DATABASE_VERSION) return;

  const runTx: (fn: () => Promise<void>) => Promise<void> =
    // Prefer exclusive transactions when available, but keep a safe fallback.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (db as any).withExclusiveTransactionAsync?.bind(db) ??
    db.withTransactionAsync.bind(db);

  await runTx(async () => {
    if (current < 1) {
      await migrateReadablesV1(db);
      current = 1;
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  });
}
