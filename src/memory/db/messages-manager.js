import BaseManager from "./base-manager.js";

/**
 * Manager for message-related database operations.
 * @class MessagesManager
 * @extends BaseManager
 */
class MessagesManager extends BaseManager {
  /**
   * Gets messages based on provided criteria.
   * @async
   * @param {Object} criteria - The search criteria
   * @param {string} criteria.conversationId - The conversation ID
   * @param {number[]} [criteria.embedding] - Embedding vector for similarity search
   * @param {number} [criteria.limit=5] - Maximum number of messages to return for similarity search
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getMessages(criteria) {
    const { conversationId, embedding, limit = 5 } = criteria;

    const queryName = embedding
      ? "get_messages_by_embedding.sql"
      : "get_messages.sql";

    const params = embedding
      ? [embedding, conversationId, limit]
      : [conversationId];

    const sql = await this.loadAndValidateQuery(queryName);
    return this.query(sql, params);
  }

  /**
   * Creates a new message in a conversation.
   * @async
   * @param {string} conversationId - The conversation ID
   * @param {string} userId - The user ID
   * @param {string} content - The message content
   * @param {number[]} [embedding] - Optional embedding vector for the message
   * @returns {Promise<{data: {id: string}|null, error: Error|null}>}
   */
  async createMessage(conversationId, userId, content, embedding = null) {
    const sql = await this.loadAndValidateQuery("create_message.sql");
    return this.query(sql, [conversationId, userId, content, embedding]);
  }

  /**
   * Updates a message's embedding.
   * @async
   * @param {string} messageId - The message ID
   * @param {number[]} embedding - The embedding vector
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async updateMessageEmbedding(messageId, embedding) {
    const sql = await this.loadAndValidateQuery("update_message_embedding.sql");
    return this.query(sql, [embedding, messageId]);
  }
}

export default MessagesManager;
