import { pgTable, text, uuid, uniqueIndex } from "drizzle-orm/pg-core";

export const contentChunks = pgTable(
  "content_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
  },
  (t) => [uniqueIndex("content_chunks_slug").on(t.slug)],
);
