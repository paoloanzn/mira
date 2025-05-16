import { Pool } from "pg";
import path from "path";
import fs from "fs/promises";
import process from "node:process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config()

/**
 * Class representing a database connection manager.
 * @class Database
 */
class Database {
  /**
   * Creates an instance of Database.
   * @constructor
   */
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DB_URL,
      ssl: false,
    });

    // In prod allows only specified queries to run
    if (process.env.NODE_ENV !== "development") {
      this.AUTHORIZED_QUERIES = Object.freeze({
        queries: [
          "create_user.sql",
          "get_user.sql",
          "create_conversation.sql",
          "get_conversation.sql",
          "add_user_to_conversation.sql",
          "create_message.sql",
          "get_messages.sql",
          "get_messages_by_embedding.sql",
          "update_message_embedding.sql"
        ],
      });
    }
  }

  /**
   * Executes a SQL query using a pooled client.
   * @async
   * @param {string} sql - The SQL query to execute.
   * @param {Array} [params=[]] - An array of parameters for the SQL query.
   * @returns {Promise<{ data: Array, error: null } | { data: null, error: Error }>} Result object.
   */
  async query(sql, params = []) {
    const queryId = Math.random().toString(36).substring(7);
    console.log(`[${new Date().toISOString()}] [Query ${queryId}] Executing SQL:`);
    console.log('SQL:', sql);
    console.log('Parameters:', params);

    let client = null;
    try {
      client = await this.pool.connect();
      const result = await client.query(sql, params);
      console.log(`[${new Date().toISOString()}] [Query ${queryId}] Query successful:`, {
        rowCount: result.rowCount,
        command: result.command,
        resultData: result.rows
      });
      return { data: result.rows, error: null };
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [Query ${queryId}] Query failed:`, {
        error: error.message,
        detail: error.detail,
        hint: error.hint,
        code: error.code
      });
      return { data: null, error };
    } finally {
      if (client) {
        client.release();
        console.log(`[${new Date().toISOString()}] [Query ${queryId}] Database client released`);
      }
    }
  }

  /**
   * Closes the database connection pool.
   * @async
   * @returns {Promise<void>}
   */
  async close() {
    await this.pool.end();
  }

  /**
   * Loads a SQL query from a file.
   * @async
   * @param {string} fileName - The filename of the SQL query to load.
   * @returns {Promise<string|undefined>} The content of the SQL file.
   */
  async loadQuery(fileName) {
    if (
      process.env.NODE_ENV !== "development" &&
      this.AUTHORIZED_QUERIES &&
      !this.AUTHORIZED_QUERIES.queries.includes(fileName)
    ) {
      return;
    }
    const filePath = path.join(__dirname, "queries", fileName);
    return await fs.readFile(filePath, "utf8");
  }

  /**
   * Executes a transaction with multiple queries.
   * @async
   * @param {Function} callback - Function that receives a client and executes queries.
   * @returns {Promise<{ data: any, error: null } | { data: null, error: Error }>} Result object.
   */
  async transaction(callback) {
    let client = null;
    try {
      client = await this.pool.connect();
      await client.query("BEGIN");
      
      const result = await callback(client);
      
      await client.query("COMMIT");
      return { data: result, error: null };
    } catch (error) {
      if (client) await client.query("ROLLBACK");
      return { data: null, error };
    } finally {
      if (client) client.release();
    }
  }
}

export default Database; 