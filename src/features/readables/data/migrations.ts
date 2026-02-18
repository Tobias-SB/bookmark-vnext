import type { SQLiteDatabase } from "expo-sqlite";

export async function migrateReadablesV1(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS readables (
      id TEXT PRIMARY KEY NOT NULL,

      kind TEXT NOT NULL CHECK (kind IN ('book', 'fanfic')),
      title TEXT NOT NULL,
      author TEXT,
      source_url TEXT,

      status TEXT NOT NULL CHECK (status IN ('to-read', 'reading', 'finished', 'dnf')),

      progress_current INTEGER NOT NULL DEFAULT 0,
      progress_total INTEGER,
      progress_unit TEXT NOT NULL CHECK (progress_unit IN ('pages', 'chapters')),

      -- Fanfic-only. NULL for books.
      is_complete INTEGER CHECK (is_complete IN (0, 1) OR is_complete IS NULL),

      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_readables_updated_at ON readables(updated_at);
    CREATE INDEX IF NOT EXISTS idx_readables_status ON readables(status);
    CREATE INDEX IF NOT EXISTS idx_readables_kind ON readables(kind);
    CREATE INDEX IF NOT EXISTS idx_readables_is_complete ON readables(is_complete);
  `);
}
