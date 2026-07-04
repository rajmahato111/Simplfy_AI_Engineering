import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let queryClient: ReturnType<typeof postgres> | null = null;

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!queryClient) queryClient = postgres(url, { max: 4, prepare: false });
  return drizzle(queryClient, { schema });
}

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}
