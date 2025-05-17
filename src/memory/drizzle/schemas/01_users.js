import * as p from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = p.pgTable(
  "users",
  {
    id: p.uuid("id").primaryKey().defaultRandom(),
    created_at: p.timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: p.timestamp("updated_at", { withTimezone: true }).defaultNow(),
    is_agent: p.boolean("is_agent").notNull().default(false),
    hostname: p.text("hostname").notNull(),
  },
  (table) => [
    p
      .uniqueIndex("is_agent_idx")
      .on(table.is_agent)
      .where(sql`${table.is_agent} = true`),
    p.unique().on(table.hostname),
  ],
);
