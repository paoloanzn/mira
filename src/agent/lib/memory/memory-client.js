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
  constructor(
    baseUrl = process.env.MEMORY_SERVICE_URL || "http://localhost:8081",
  ) {
    this.baseUrl = baseUrl;
    // Cache for active conversations
    this.conversationMap = new Map(); // userId -> conversationId mapping
  }

  /**
   * Makes a request to the memory service.
   * @private
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method
   * @param {Object} [body] - Request body
   * @param {Object} [queryParams] - Query parameters
   * @returns {Promise<{data: any, error: Error|null}>}
   */
  async _request(endpoint, method, body = null, queryParams = null) {
    const requestId = Math.random().toString(36).substring(7);
    let url = `${this.baseUrl}/memory${endpoint}`;

    if (queryParams) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key + "[]", v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
      url += `?${params.toString()}`;
    }

    console.log(
      `[${new Date().toISOString()}] [Request ${requestId}] Sending request:`,
    );
    console.log(`URL: ${url}`);
    console.log(`Method: ${method}`);
    console.log("Body:", body);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Origin: "http://agent-service",
        },
        body: body ? JSON.stringify(body) : null,
      });

      console.log(
        `[${new Date().toISOString()}] [Request ${requestId}] Received response:`,
      );
      console.log(`Status: ${response.status}`);

      if (!response.ok) {
        const error = await response.json();
        console.error(
          `[${new Date().toISOString()}] [Request ${requestId}] Error response:`,
          error,
        );
        throw new Error(
          error.error || `Request failed with status ${response.status}`,
        );
      }

      if (response.status === 204) {
        console.log(
          `[${new Date().toISOString()}] [Request ${requestId}] No content response`,
        );
        return { data: null, error: null };
      }

      const data = await response.json();
      console.log(
        `[${new Date().toISOString()}] [Request ${requestId}] Success response:`,
        data,
      );
      return { data, error: null };
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] [Request ${requestId}] Request failed:`,
        error,
      );
      return { data: null, error };
    }
  }

  /**
   * Get or create a user by hostname
   * @param {string} hostname - The hostname to identify the user
   * @param {Object} [options] - Additional options for user creation
   * @param {boolean} [options.is_agent] - Whether the user is an agent
   * @returns {Promise<{userId: string|null, error: Error|null}>}
   */
  async getOrCreateUser(hostname, options = {}) {
    try {
      // If this is an agent user, look for existing agent
      if (options.is_agent) {
        const { data: user, error: searchError } = await this._request(
          "/users",
          "GET",
          null,
          { is_agent: true },
        );
        if (user && !searchError) {
          return { userId: user.id, error: null };
        }
      }

      // Look for existing user by hostname
      const { data: existingUser, error: searchError } = await this._request(
        "/users",
        "GET",
        null,
        { hostname },
      );
      if (existingUser && !searchError) {
        return { userId: existingUser.id, error: null };
      }

      // Create new user
      const { data: newUser, error: createError } = await this._request(
        "/users",
        "POST",
        { hostname, is_agent: options.is_agent || false },
      );
      if (createError) throw createError;

      return { userId: newUser.id, error: null };
    } catch (error) {
      return {
        userId: null,
        error: new Error(`Failed to get/create user: ${error.message}`),
      };
    }
  }

  /**
   * Gets or creates a conversation for a user with the agent.
   * @param {string} userId - The user's ID
   * @param {string} agentUserId - The agent's user ID
   * @returns {Promise<{conversationId: string|null, error: Error|null}>}
   */
  async getOrCreateConversation(userId, agentUserId) {
    try {
      // Check if we already have a conversation for this user
      let conversationId = this.conversationMap.get(userId);
      if (conversationId) {
        return { conversationId, error: null };
      }

      // Create new conversation with user and agent
      const { data, error } = await this.createConversation([
        userId,
        agentUserId,
      ]);
      if (error) throw error;

      conversationId = data.id;
      this.conversationMap.set(userId, conversationId);
      return { conversationId, error: null };
    } catch (error) {
      return {
        conversationId: null,
        error: new Error(`Failed to get/create conversation: ${error.message}`),
      };
    }
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
   * @param {number[]} [embedding] - Optional embedding vector for the message
   * @returns {Promise<{data: {id: string}|null, error: Error|null}>}
   */
  async createMessage(conversationId, userId, content, embedding = null) {
    return this._request(`/conversations/${conversationId}/messages`, "POST", {
      userId,
      content,
      embedding,
    });
  }

  /**
   * Gets messages from a conversation.
   * @param {string} conversationId - The conversation ID
   * @param {Object} [options] - Additional options
   * @param {number[]} [options.embedding] - Embedding vector for similarity search
   * @param {number} [options.limit] - Maximum number of messages to return
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getMessages(conversationId, options = {}) {
    return this._request(
      `/conversations/${conversationId}/messages`,
      "GET",
      null,
      options,
    );
  }

  /**
   * Formats messages into a conversation string.
   * @param {Array} messages - Array of message objects
   * @param {string} agentUserId - The agent's user ID
   * @returns {string} Formatted conversation string
   */
  formatConversation(messages, agentUserId) {
    return messages
      .map((msg) => {
        const timestamp = new Date(msg.created_at).toISOString();
        const role = msg.user_id === agentUserId ? "agent" : "user";
        return `[${timestamp}](${role}) ${msg.content}`;
      })
      .join("\n");
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
