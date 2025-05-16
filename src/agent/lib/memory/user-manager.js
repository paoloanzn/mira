import { getMemoryClient } from "./memory-client.js";
import { updateEnvVariable } from "../utils/envManager.js";

/**
 * Manages user-related operations and maintains a mapping of hostnames to user IDs.
 */
class UserManager {
  constructor() {
    this.memoryClient = getMemoryClient();
    this.userMap = new Map(); // hostname -> userId mapping
  }

  /**
   * Gets or creates a user ID for a hostname.
   * @param {string} hostname - The hostname to get/create a user for
   * @returns {Promise<{userId: string|null, error: Error|null}>}
   */
  async getOrCreateUser(hostname) {
    try {
      // Check if we already have a user ID for this hostname
      let userId = this.userMap.get(hostname);
      if (userId) {
        return { userId, error: null };
      }

      // Create new user
      const { data, error } = await this.memoryClient.createUser();
      if (error) {
        throw error;
      }

      userId = data.id;
      this.userMap.set(hostname, userId);
      return { userId, error: null };
    } catch (error) {
      return { userId: null, error };
    }
  }

  /**
   * Gets or creates the agent's user ID.
   * @returns {Promise<{userId: string|null, error: Error|null}>}
   */
  async getOrCreateAgentUser() {
    try {
      // Check if we already have the agent's user ID in env
      let agentUserId = process.env.AGENT_USER_ID;
      if (agentUserId) {
        return { userId: agentUserId, error: null };
      }

      // Create new user for the agent
      const { data, error } = await this.memoryClient.createUser();
      if (error) {
        throw error;
      }

      agentUserId = data.id;

      return { userId: agentUserId, error: null };
    } catch (error) {
      return { userId: null, error };
    }
  }

  /**
   * Gets a user by ID.
   * @param {string} userId - The user ID to get
   * @returns {Promise<{user: Object|null, error: Error|null}>}
   */
  async getUser(userId) {
    try {
      const { data, error } = await this.memoryClient.getUser(userId);
      if (error) {
        throw error;
      }
      return { user: data, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }
}

// Create a singleton instance
let manager = null;

/**
 * Gets the singleton instance of UserManager.
 * @returns {UserManager} The UserManager instance
 */
export function getUserManager() {
  if (!manager) {
    manager = new UserManager();
  }
  return manager;
}
