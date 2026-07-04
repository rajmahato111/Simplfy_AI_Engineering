import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as searchSchema from "./search-schema";

let queryClient: ReturnType<typeof postgres> | null = null;

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!queryClient) queryClient = postgres(url, { max: 4, prepare: false });
  return drizzle(queryClient, { schema: { ...schema, ...searchSchema } });
}

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

/** Close the Postgres pool — required for CLI scripts to exit cleanly. */
export async function closeDb() {
  if (queryClient) {
    await queryClient.end({ timeout: 5 });
    queryClient = null;
  }
}
