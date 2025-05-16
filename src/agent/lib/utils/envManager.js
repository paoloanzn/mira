import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Updates a single environment variable in the .env file
 * @param {string} key - The environment variable key to update
 * @param {string} value - The new value to set
 * @throws {Error} If the .env file cannot be read or written
 */
export async function updateEnvVariable(key, value) {
  try {
    // Find the .env file by walking up the directory tree
    const envPath = await findEnvFile();
    
    // Read current .env content
    const currentContent = await fs.readFile(envPath, 'utf-8');
    
    // Parse current content into an object
    const envConfig = dotenv.parse(currentContent);
    
    // Update the value
    envConfig[key] = value;
    
    // Convert back to .env format
    const newContent = Object.entries(envConfig)
      .map(([k, v]) => `${k}=${formatEnvValue(v)}`)
      .join('\n');
    
    // Write back to file
    await fs.writeFile(envPath, newContent);
    
    // Update process.env
    process.env[key] = value;
  } catch (error) {
    throw new Error(`Failed to update environment variable: ${error.message}`);
  }
}

/**
 * Formats a value for .env file storage
 * @private
 * @param {any} value - The value to format
 * @returns {string} Formatted value
 */
function formatEnvValue(value) {
  if (typeof value === 'string') {
    // Check if value contains spaces or special characters
    if (/[\s"'`]/.test(value)) {
      // Escape quotes in the value and wrap in double quotes
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
  }
  if (typeof value === 'object') {
    return `"${JSON.stringify(value).replace(/"/g, '\\"')}"`;
  }
  return String(value);
}

/**
 * Finds the .env file by walking up the directory tree
 * @private
 * @returns {Promise<string>} Path to the .env file
 * @throws {Error} If no .env file is found
 */
async function findEnvFile() {
  let currentDir = process.cwd();
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    const envPath = path.join(currentDir, '.env');
    try {
      await fs.access(envPath);
      return envPath;
    } catch {
      currentDir = path.dirname(currentDir);
    }
  }
  
  throw new Error('.env file not found in directory tree');
} 