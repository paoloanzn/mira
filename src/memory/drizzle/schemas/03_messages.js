import * as p from "drizzle-orm/pg-core";
import { users } from "./01_users.js";
import { conversations } from "./02_conversations.js";

// Custom vector type for pgvector
const vector = (dimensions) =>
  p.customType({
    name: "vector",
    dataType() {
      return `vector(${dimensions})`;
    },
  });

export const messages = p.pgTable("messages", {
  id: p.uuid("id").primaryKey().defaultRandom(),
  conversation_id: p
    .uuid("conversation_id")
    .references(() => conversations.id, { onDelete: "cascade" }),
  user_id: p
    .uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" }),
  content: p.text("content").notNull(),
  embedding: vector(1536)("embedding"),
  created_at: p.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: p.timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
