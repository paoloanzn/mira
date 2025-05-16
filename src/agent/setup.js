import * as dotenv from "dotenv";
import path from "path";
import process from "node:process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Loads environment variables from a .env file and sets up development-specific variables.
 *
 * This function configures the environment variables using dotenv by loading them from a file located
 * two directories up from the current file. If the NODE_ENV variable is set to 'development', it iterates
 * over all environment variables and for each key starting with 'DEV_', it creates a new variable without
 * the 'DEV_' prefix.
 *
 * @function loadEnv
 */
export function loadEnv() {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });

  if (process.env.NODE_ENV === "development") {
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("DEV_")) {
        const nonDevKey = key.replace(/^DEV_/, "");
        process.env[nonDevKey] = process.env[key];
      }
    });
  }
}

/**
 * Main setup function that runs all initialization steps
 */
export async function setup() {
  // Load environment variables first
  loadEnv();
}
