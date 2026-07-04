import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  proUntil: timestamp("pro_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProgress = pgTable(
  "user_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    completed: boolean("completed").default(false).notNull(),
    bookmarked: boolean("bookmarked").default(false).notNull(),
    lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("user_progress_user_slug").on(t.userId, t.slug)],
);

export const mockSessions = pgTable("mock_sessions", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  questionSlug: text("question_slug").notNull(),
  notes: text("notes").notNull().default("[]"),
  scorecard: text("scorecard"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export type User = typeof users.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type MockSession = typeof mockSessions.$inferSelect;
