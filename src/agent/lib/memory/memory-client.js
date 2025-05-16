import fetch from "node-fetch";

/**
 * Client for interacting with the memory service.
 * Handles all communication between the agent and memory service.
 */
class MemoryClient {
  /**
   * Creates a new MemoryClient instance.
   * @param {string} baseUrl - Base URL of the memory service
   */
  constructor(baseUrl = process.env.MEMORY_SERVICE_URL || "http://localhost:8081") {
    this.baseUrl = baseUrl;
  }

  /**
   * Makes a request to the memory service.
   * @private
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method
   * @param {Object} [body] - Request body
   * @returns {Promise<{data: any, error: Error|null}>}
   */
  async _request(endpoint, method, body = null) {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${new Date().toISOString()}] [Request ${requestId}] Sending request:`);
    console.log(`URL: ${this.baseUrl}/memory${endpoint}`);
    console.log(`Method: ${method}`);
    console.log('Body:', body);

    try {
      const response = await fetch(`${this.baseUrl}/memory${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://agent-service"
        },
        body: body ? JSON.stringify(body) : null,
      });

      console.log(`[${new Date().toISOString()}] [Request ${requestId}] Received response:`);
      console.log(`Status: ${response.status}`);
      
      if (!response.ok) {
        const error = await response.json();
        console.error(`[${new Date().toISOString()}] [Request ${requestId}] Error response:`, error);
        throw new Error(error.error || `Request failed with status ${response.status}`);
      }

      if (response.status === 204) {
        console.log(`[${new Date().toISOString()}] [Request ${requestId}] No content response`);
        return { data: null, error: null };
      }

      const data = await response.json();
      console.log(`[${new Date().toISOString()}] [Request ${requestId}] Success response:`, data);
      return { data, error: null };
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [Request ${requestId}] Request failed:`, error);
      return { data: null, error };
    }
  }

  /**
   * Creates a new user.
   * @returns {Promise<{data: {id: string}|null, error: Error|null}>}
   */
  async createUser() {
    return this._request("/users", "POST", {});
  }

  /**
   * Gets a user by ID.
   * @param {string} userId - The user's ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getUser(userId) {
    return this._request(`/users/${userId}`, "GET");
  }

  /**
   * Creates a new conversation.
   * @param {string[]} userIds - Array of user IDs to add to the conversation
   * @returns {Promise<{data: {id: string}|null, error: Error|null}>}
   */
  async createConversation(userIds) {
    return this._request("/conversations", "POST", { userIds });
  }

  /**
   * Creates a new message in a conversation.
   * @param {string} conversationId - The conversation ID
   * @param {string} userId - The user ID
   * @param {string} content - The message content
   * @returns {Promise<{data: {id: string}|null, error: Error|null}>}
   */
  async createMessage(conversationId, userId, content) {
    return this._request(
      `/conversations/${conversationId}/messages`,
      "POST",
      { userId, content }
    );
  }

  /**
   * Gets messages from a conversation.
   * @param {string} conversationId - The conversation ID
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getMessages(conversationId) {
    return this._request(`/conversations/${conversationId}/messages`, "GET");
  }
}

// Create a singleton instance
let client = null;

/**
 * Gets the singleton instance of MemoryClient.
 * @returns {MemoryClient} The MemoryClient instance
 */
export function getMemoryClient() {
  if (!client) {
    client = new MemoryClient();
  }
  return client;
} 