import * as dotenv from "dotenv";
import path from "path";
import process from "node:process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs/promises";
import { updateEnvVariables } from "../lib/utils/envManager.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Ensures the config directory exists and returns its path
 * @private
 * @returns {Promise<string>} Path to the config directory
 */
async function ensureConfigDir() {
  const configDir = path.resolve(__dirname, "../../config");
  try {
    await fs.access(configDir);
  } catch {
    await fs.mkdir(configDir, { recursive: true });
  }
  return configDir;
}

/**
 * Loads environment variables from a .env file and sets up development-specific variables.
 *
 * This function configures the environment variables using dotenv by loading them from a file located
 * in the config directory. If the NODE_ENV variable is set to 'development', it iterates
 * over all environment variables and for each key starting with 'DEV_', it creates a new variable without
 * the 'DEV_' prefix.
 *
 * @function loadEnv
 */
export async function loadEnv() {
  const configDir = await ensureConfigDir();
  const envPath = path.join(configDir, ".env");
  try {
    await fs.access(envPath);
  } catch {
    await fs.writeFile(envPath, "", { flag: "w" });
    await updateEnvVariables({
      TWITTER_USERNAME: process.env.TWITTER_USERNAME,
      TWITTER_EMAIL: process.env.TWITTER_EMAIL,
      TWITTER_PASSWORD: process.env.TWITTER_PASSWORD,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY
    })
  }

  // Try to load from config directory first
  const configResult = dotenv.config({ path: envPath });

  // If no .env in config, try loading from root directory
  if (configResult.error) {
    const rootEnvPath = path.resolve(__dirname, "../../.env");
    dotenv.config({ path: rootEnvPath });
  }

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
  await loadEnv();
}
