import type { SQLiteDatabase } from "expo-sqlite";

export async function migrateReadablesV1(db: SQLiteDatabase) {
  // 1) Create the canonical table for fresh installs.
  // 2) Introspect & repair legacy tables by adding missing columns.
  // 3) Backfill sane defaults.
  // 4) Create indexes.

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
  `);

  type TableInfoRow = { name: string };
  const cols = await db.getAllAsync<TableInfoRow>(
    "PRAGMA table_info(readables)",
  );
  const colSet = new Set(cols.map((c) => c.name));
  const now = new Date().toISOString();

  async function addColumn(sql: string) {
    try {
      await db.execAsync(sql);
    } catch (e) {
      // If a column was added concurrently or the statement is unsupported,
      // we prefer to keep the migration moving rather than hard-crash.
      console.warn("[migrateReadablesV1] addColumn failed", sql, e);
    }
  }

  // Legacy schema repair: add missing columns (without CHECK constraints).
  if (!colSet.has("kind")) {
    await addColumn("ALTER TABLE readables ADD COLUMN kind TEXT");
  }
  if (!colSet.has("author")) {
    await addColumn("ALTER TABLE readables ADD COLUMN author TEXT");
  }
  if (!colSet.has("source_url")) {
    await addColumn("ALTER TABLE readables ADD COLUMN source_url TEXT");
  }
  if (!colSet.has("status")) {
    await addColumn("ALTER TABLE readables ADD COLUMN status TEXT");
  }
  if (!colSet.has("progress_current")) {
    await addColumn(
      "ALTER TABLE readables ADD COLUMN progress_current INTEGER",
    );
  }
  if (!colSet.has("progress_total")) {
    await addColumn("ALTER TABLE readables ADD COLUMN progress_total INTEGER");
  }
  if (!colSet.has("progress_unit")) {
    await addColumn("ALTER TABLE readables ADD COLUMN progress_unit TEXT");
  }
  if (!colSet.has("is_complete")) {
    await addColumn("ALTER TABLE readables ADD COLUMN is_complete INTEGER");
  }
  if (!colSet.has("created_at")) {
    await addColumn("ALTER TABLE readables ADD COLUMN created_at TEXT");
  }
  if (!colSet.has("updated_at")) {
    await addColumn("ALTER TABLE readables ADD COLUMN updated_at TEXT");
  }

  // Re-read columns after potential ALTER TABLEs.
  const cols2 = await db.getAllAsync<TableInfoRow>(
    "PRAGMA table_info(readables)",
  );
  const colSet2 = new Set(cols2.map((c) => c.name));

  // Backfill minimal defaults so app code doesn't trip over NULLs.
  if (colSet2.has("created_at")) {
    await db.runAsync(
      "UPDATE readables SET created_at = COALESCE(created_at, ?) WHERE created_at IS NULL OR created_at = ''",
      [now],
    );
  }

  if (colSet2.has("updated_at")) {
    await db.runAsync(
      "UPDATE readables SET updated_at = COALESCE(updated_at, ?) WHERE updated_at IS NULL OR updated_at = ''",
      [now],
    );
  }

  if (colSet2.has("progress_current")) {
    await db.execAsync(
      "UPDATE readables SET progress_current = 0 WHERE progress_current IS NULL",
    );
  }

  if (colSet2.has("status")) {
    await db.execAsync(
      "UPDATE readables SET status = 'to-read' WHERE status IS NULL OR status = ''",
    );
  }

  if (colSet2.has("kind")) {
    if (colSet2.has("source_url")) {
      // Heuristic: if a legacy row has a source_url, it's probably a fanfic.
      await db.execAsync(
        "UPDATE readables SET kind = CASE WHEN source_url IS NOT NULL AND source_url != '' THEN 'fanfic' ELSE 'book' END WHERE kind IS NULL OR kind = ''",
      );
    } else {
      await db.execAsync(
        "UPDATE readables SET kind = 'book' WHERE kind IS NULL OR kind = ''",
      );
    }
  }

  if (colSet2.has("progress_unit")) {
    if (colSet2.has("kind")) {
      await db.execAsync(
        "UPDATE readables SET progress_unit = CASE WHEN kind = 'fanfic' THEN 'chapters' ELSE 'pages' END WHERE progress_unit IS NULL OR progress_unit = ''",
      );
    } else {
      await db.execAsync(
        "UPDATE readables SET progress_unit = 'pages' WHERE progress_unit IS NULL OR progress_unit = ''",
      );
    }
  }

  // Indexes (create individually so one failure doesn't nuke the whole init).
  await db.execAsync(
    "CREATE INDEX IF NOT EXISTS idx_readables_updated_at ON readables(updated_at)",
  );
  await db.execAsync(
    "CREATE INDEX IF NOT EXISTS idx_readables_status ON readables(status)",
  );
  if (colSet2.has("kind")) {
    await db.execAsync(
      "CREATE INDEX IF NOT EXISTS idx_readables_kind ON readables(kind)",
    );
  }
  if (colSet2.has("is_complete")) {
    await db.execAsync(
      "CREATE INDEX IF NOT EXISTS idx_readables_is_complete ON readables(is_complete)",
    );
  }
}
