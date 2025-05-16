import { getMemoryClient } from "./memory-client.js";

/**
 * Manages conversation-related operations and maintains a mapping of users to conversations.
 */
class ConversationManager {
  constructor() {
    this.memoryClient = getMemoryClient();
    this.conversationMap = new Map(); // userId -> conversationId mapping
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
      const { data, error } = await this.memoryClient.createConversation([
        userId,
        agentUserId,
      ]);
      if (error) {
        throw error;
      }

      conversationId = data.id;
      this.conversationMap.set(userId, conversationId);
      return { conversationId, error: null };
    } catch (error) {
      return { conversationId: null, error };
    }
  }

  /**
   * Gets messages from a conversation.
   * @param {string} conversationId - The conversation ID
   * @returns {Promise<{messages: Array|null, error: Error|null}>}
   */
  async getMessages(conversationId) {
    try {
      const { data, error } =
        await this.memoryClient.getMessages(conversationId);
      if (error) {
        throw error;
      }
      return { messages: data, error: null };
    } catch (error) {
      return { messages: null, error };
    }
  }

  /**
   * Adds a message to a conversation.
   * @param {string} conversationId - The conversation ID
   * @param {string} userId - The user ID
   * @param {string} content - The message content
   * @returns {Promise<{messageId: string|null, error: Error|null}>}
   */
  async addMessage(conversationId, userId, content) {
    try {
      const { data, error } = await this.memoryClient.createMessage(
        conversationId,
        userId,
        content,
      );
      if (error) {
        throw error;
      }
      return { messageId: data.id, error: null };
    } catch (error) {
      return { messageId: null, error };
    }
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
let manager = null;

/**
 * Gets the singleton instance of ConversationManager.
 * @returns {ConversationManager} The ConversationManager instance
 */
export function getConversationManager() {
  if (!manager) {
    manager = new ConversationManager();
  }
  return manager;
}
