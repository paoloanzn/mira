import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql" | "turso" | "singlestore"
  schema: "./src/memory/drizzle/schemas/*.js",
  out: "./src/memory/drizzle/migrations",
});
