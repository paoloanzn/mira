import Database from "./database.js";

/**
 * Base class for database managers.
 * Provides common functionality for all managers.
 * @class BaseManager
 * @extends Database
 */
class BaseManager extends Database {
  /**
   * Loads and validates a query.
   * @protected
   * @param {string} queryName - The name of the query file to load
   * @returns {Promise<string>} The loaded query
   * @throws {Error} If the query is not found or not authorized
   */
  async loadAndValidateQuery(queryName) {
    const sql = await this.loadQuery(queryName);
    if (!sql) {
      throw new Error(`Query not authorized or not found: ${queryName}`);
    }
    return sql;
  }
}

export default BaseManager;
