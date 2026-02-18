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

  if (current >= DATABASE_VERSION) return;

  await db.withTransactionAsync(async () => {
    if (current === 0) {
      await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        PRAGMA foreign_keys = ON;
      `);
    }

    if (current < 1) {
      await migrateReadablesV1(db);
      current = 1;
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  });
}
