import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { CustomBaseError, ErrorType } from "../../agent/api/errors/errors.js";

/**
 * Creates a new .env file if it doesn't exist
 * @private
 * @returns {Promise<string>} Path to the .env file
 * @throws {CustomBaseError} If the .env file cannot be created
 */
async function createEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env");
    await fs.writeFile(envPath, "", "utf-8");
    return envPath;
  } catch (error) {
    throw new CustomBaseError(
      `Failed to create .env file: ${error.message}`,
      ErrorType.BUSINESS_LOGIC,
      error,
    );
  }
}

/**
 * Finds or creates the .env file
 * @private
 * @returns {Promise<string>} Path to the .env file
 * @throws {CustomBaseError} If the .env file cannot be found or created
 */
async function findOrCreateEnvFile() {
  try {
    return await findEnvFile();
  } catch (error) {
    if (error.message === ".env file not found in directory tree") {
      return await createEnvFile();
    }
    throw new CustomBaseError(
      `Failed to find or create .env file: ${error.message}`,
      ErrorType.BUSINESS_LOGIC,
      error,
    );
  }
}

/**
 * Gets the value of an environment variable
 * @param {string} key - The environment variable key to get
 * @returns {Promise<string|null>} The value of the environment variable or null if not found
 * @throws {CustomBaseError} If the .env file cannot be read
 */
export async function getEnvVariable(key) {
  try {
    const envPath = await findOrCreateEnvFile();
    const currentContent = await fs.readFile(envPath, "utf-8");
    const envConfig = dotenv.parse(currentContent);
    return envConfig[key] || null;
  } catch (error) {
    throw new CustomBaseError(
      `Failed to get environment variable: ${error.message}`,
      ErrorType.BUSINESS_LOGIC,
      error,
    );
  }
}

/**
 * Updates a single environment variable in the .env file
 * @param {string} key - The environment variable key to update
 * @param {string} value - The new value to set
 * @throws {CustomBaseError} If the .env file cannot be read or written
 */
export async function updateEnvVariable(key, value) {
  try {
    const envPath = await findOrCreateEnvFile();
    const currentContent = await fs.readFile(envPath, "utf-8");
    const envConfig = dotenv.parse(currentContent);
    envConfig[key] = value;

    const newContent = Object.entries(envConfig)
      .map(([k, v]) => `${k}=${formatEnvValue(v)}`)
      .join("\n");

    await fs.writeFile(envPath, newContent);
    process.env[key] = value;
  } catch (error) {
    throw new CustomBaseError(
      `Failed to update environment variable: ${error.message}`,
      ErrorType.BUSINESS_LOGIC,
      error,
    );
  }
}

/**
 * Updates multiple environment variables in the .env file
 * @param {Object} variables - Object containing key-value pairs of environment variables
 * @throws {CustomBaseError} If the .env file cannot be read or written
 */
export async function updateEnvVariables(variables) {
  try {
    const envPath = await findOrCreateEnvFile();
    const currentContent = await fs.readFile(envPath, "utf-8");
    const envConfig = dotenv.parse(currentContent);

    Object.entries(variables).forEach(([key, value]) => {
      envConfig[key] = value;
      process.env[key] = value;
    });

    const newContent = Object.entries(envConfig)
      .map(([k, v]) => `${k}=${formatEnvValue(v)}`)
      .join("\n");

    await fs.writeFile(envPath, newContent);
  } catch (error) {
    throw new CustomBaseError(
      `Failed to update environment variables: ${error.message}`,
      ErrorType.BUSINESS_LOGIC,
      error,
    );
  }
}

/**
 * Formats a value for .env file storage
 * @private
 * @param {any} value - The value to format
 * @returns {string} Formatted value
 */
function formatEnvValue(value) {
  if (typeof value === "string") {
    // Check if the string is already properly formatted with single quotes
    if (value.startsWith("'") && value.endsWith("'")) {
      return value;
    }

    // Check if the string is a JSON array or object
    if (
      (value.startsWith("[") && value.endsWith("]")) ||
      (value.startsWith("{") && value.endsWith("}"))
    ) {
      try {
        // Try to parse it to verify it's valid JSON
        JSON.parse(value);
        // If it's valid JSON, wrap it in single quotes
        return `'${value}'`;
      } catch {
        // If it's not valid JSON, treat it as a regular string
      }
    }

    // For regular strings, use double quotes if needed
    if (/[\s"'`]/.test(value)) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
  }
  if (typeof value === "object") {
    return `'${JSON.stringify(value)}'`;
  }
  return String(value);
}

/**
 * Finds the .env file by walking up the directory tree and checking config directory
 * @private
 * @returns {Promise<string>} Path to the .env file
 * @throws {CustomBaseError} If no .env file is found
 */
async function findEnvFile() {
  let currentDir = process.cwd();
  const root = path.parse(currentDir).root;

  // First check if we're in the agent service and look for config/.env
  const configEnvPath = path.join(currentDir, "config", ".env");
  try {
    await fs.access(configEnvPath);
    return configEnvPath;
  } catch {
    // If not found in config, continue with normal search
  }

  // Then walk up the directory tree looking for .env
  while (currentDir !== root) {
    const envPath = path.join(currentDir, ".env");
    try {
      await fs.access(envPath);
      return envPath;
    } catch {
      currentDir = path.dirname(currentDir);
    }
  }

  throw new CustomBaseError(
    ".env file not found in directory tree or config directory",
    ErrorType.BUSINESS_LOGIC,
  );
}
