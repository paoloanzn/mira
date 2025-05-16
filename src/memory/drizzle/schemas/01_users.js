import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.uuid("id").primaryKey().defaultRandom(),
  created_at: p.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: p.timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
