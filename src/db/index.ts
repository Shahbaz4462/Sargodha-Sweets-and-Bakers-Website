import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __sargodhaPostgresPool?: Pool;
  __sargodhaPostgresDb?: NodePgDatabase<typeof schema>;
  __sargodhaLocalPglite?: PGlite;
  __sargodhaLocalDbReady?: Promise<void>;
};

function createPostgresPool(connectionString: string): Pool {
  const isServerless = Boolean(process.env.VERCEL);
  const configuredMax = Number.parseInt(process.env.POSTGRES_POOL_MAX || "", 10);
  const defaultMax = isServerless ? 1 : 2;
  const poolMax =
    Number.isFinite(configuredMax) && configuredMax > 0
      ? Math.min(configuredMax, isServerless ? 1 : 5)
      : defaultMax;

  const postgresPool = new Pool({
    connectionString,
    max: poolMax,
    idleTimeoutMillis: isServerless ? 10_000 : 30_000,
    connectionTimeoutMillis: 8_000,
    allowExitOnIdle: true,
  });

  postgresPool.on("error", (error) => {
    console.error("PostgreSQL pool error: unexpected idle client failure");
    if (error instanceof Error) {
      console.error(error.message);
    }
  });

  console.info(`PostgreSQL pool initialized with max ${poolMax} client(s)`);
  return postgresPool;
}

if (databaseUrl && !globalForDb.__sargodhaPostgresPool) {
  globalForDb.__sargodhaPostgresPool = createPostgresPool(databaseUrl);
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
