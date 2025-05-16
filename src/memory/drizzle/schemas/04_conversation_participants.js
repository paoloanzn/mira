import * as p from "drizzle-orm/pg-core";
import { users } from "./01_users.js";
import { conversations } from "./02_conversations.js";

export const conversationParticipants = p.pgTable("conversation_participants", {
  conversation_id: p.uuid("conversation_id")
    .references(() => conversations.id, { onDelete: "cascade" }),
  user_id: p.uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" }),
  created_at: p.timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  pk: p.primaryKey(table.conversation_id, table.user_id),
})); 