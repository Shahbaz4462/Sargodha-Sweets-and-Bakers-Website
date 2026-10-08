import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === "production") {
  throw new Error("DATABASE_URL is required in production");
}

const globalForDb = globalThis as typeof globalThis & {
  __sargodhaPostgresPool?: Pool;
  __sargodhaPostgresDb?: NodePgDatabase<typeof schema>;
  __sargodhaLocalPglite?: PGlite;
  __sargodhaLocalDbReady?: Promise<void>;
};

if (databaseUrl && !globalForDb.__sargodhaPostgresPool) {
  const postgresPool = new Pool({
    connectionString: databaseUrl,
    max: 1,
    idleTimeoutMillis: 1_000,
    connectionTimeoutMillis: 30_000,
    allowExitOnIdle: true,
  });
  postgresPool.on("error", (error) => {
    console.error("Unexpected idle PostgreSQL client error", error);
  });
  globalForDb.__sargodhaPostgresPool = postgresPool;
}

export const pool = databaseUrl ? globalForDb.__sargodhaPostgresPool : undefined;

const localClient = databaseUrl
  ? undefined
  : globalForDb.__sargodhaLocalPglite ?? new PGlite(join(process.cwd(), ".local-db"));

if (localClient && process.env.NODE_ENV !== "production") {
  globalForDb.__sargodhaLocalPglite = localClient;
}

const localDb = localClient ? drizzlePglite(localClient, { schema }) : undefined;
const postgresDb = pool
  ? globalForDb.__sargodhaPostgresDb ?? drizzlePostgres(pool, { schema })
  : undefined;

if (postgresDb && !globalForDb.__sargodhaPostgresDb) {
  globalForDb.__sargodhaPostgresDb = postgresDb;
}

export const db = (postgresDb ?? localDb) as NodePgDatabase<typeof schema>;

export async function initializeDatabase() {
  if (!localClient || !localDb) return;

  globalForDb.__sargodhaLocalDbReady ??= (async () => {
    await localClient.waitReady;
    const result = await localClient.query<{ table_name: string | null }>(
      "SELECT to_regclass('public.users') AS table_name"
    );

    if (!result.rows[0]?.table_name) {
      const migration = readFileSync(
        join(process.cwd(), "src/db/migrations/0000_initial.sql"),
        "utf8"
      );
      await localClient.exec(migration);
    }
  })();

  await globalForDb.__sargodhaLocalDbReady;
}
