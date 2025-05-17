import BaseManager from "./base-manager.js";

/**
 * Manager for user-related database operations.
 * @class UsersManager
 * @extends BaseManager
 */
class UsersManager extends BaseManager {
  /**
   * Gets a user based on provided criteria.
   * @async
   * @param {Object} criteria - The search criteria
   * @param {string} [criteria.id] - User ID
   * @param {string} [criteria.hostname] - User hostname
   * @param {boolean} [criteria.isAgent] - Whether to get an agent user
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   * @throws {Error} If no valid criteria provided
   */
  async getUser(criteria = {}) {
    const { id, hostname, isAgent } = criteria;

    let queryName;
    let params = [];

    if (id) {
      queryName = "get_user.sql";
      params = [id];
    } else if (hostname) {
      queryName = "get_user_by_hostname.sql";
      params = [hostname];
    } else if (isAgent) {
      queryName = "get_agent_user.sql";
      params = [];
    } else {
      throw new Error("At least one search criteria must be provided");
    }

    const sql = await this.loadAndValidateQuery(queryName);
    return this.query(sql, params);
  }

  /**
   * Creates a new user.
   * @async
   * @param {boolean} isAgent - Whether the user is an agent
   * @param {string} hostname - The hostname to identify the user
   * @returns {Promise<{data: {id: string}|null, error: Error|null}>}
   */
  async createUser(isAgent, hostname) {
    const sql = await this.loadAndValidateQuery("create_user.sql");
    return this.query(sql, [isAgent, hostname]);
  }
}

export default UsersManager;
