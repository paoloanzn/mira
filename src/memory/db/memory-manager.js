import Database from "./database.js";

/**
 * Class for managing memory operations.
 * @class MemoryManager
 * @extends Database
 */
class MemoryManager extends Database {
  /**
   * Creates a new user.
   * @async
   * @returns {Promise<{data: {id: string}|null, error: Error|null}>}
   */
  async createUser() {
    const sql = await this.loadQuery("create_user.sql");
    if (!sql) {
      throw new Error("Query not authorized or not found: create_user.sql");
    }
    return this.query(sql);
  }

  /**
   * Gets a user by ID.
   * @async
   * @param {string} userId - The user's ID.
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getUser(userId) {
    const sql = await this.loadQuery("get_user.sql");
    if (!sql) {
      throw new Error("Query not authorized or not found: get_user.sql");
    }
    return this.query(sql, [userId]);
  }

  /**
   * Creates a new conversation.
   * @async
   * @param {string[]} userIds - Array of user IDs to add to the conversation.
   * @returns {Promise<{data: {id: string}|null, error: Error|null}>}
   */
  async createConversation(userIds) {
    return this.transaction(async (client) => {
      // Create conversation
      const createConvSql = await this.loadQuery("create_conversation.sql");
      if (!createConvSql) {
        throw new Error(
          "Query not authorized or not found: create_conversation.sql",
        );
      }
      const {
        rows: [conversation],
      } = await client.query(createConvSql);

      // Add users to conversation
      const addUserSql = await this.loadQuery("add_user_to_conversation.sql");
      if (!addUserSql) {
        throw new Error(
          "Query not authorized or not found: add_user_to_conversation.sql",
        );
      }

      await Promise.all(
        userIds.map((userId) =>
          client.query(addUserSql, [conversation.id, userId]),
        ),
      );

      return conversation;
    });
  }

  /**
   * Creates a new message in a conversation.
   * @async
   * @param {string} conversationId - The conversation ID.
   * @param {string} userId - The user ID.
   * @param {string} content - The message content.
   * @returns {Promise<{data: {id: string}|null, error: Error|null}>}
   */
  async createMessage(conversationId, userId, content) {
    const sql = await this.loadQuery("create_message.sql");
    if (!sql) {
      throw new Error("Query not authorized or not found: create_message.sql");
    }
    return this.query(sql, [conversationId, userId, content]);
  }

  /**
   * Gets messages from a conversation.
   * @async
   * @param {string} conversationId - The conversation ID.
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getMessages(conversationId) {
    const sql = await this.loadQuery("get_messages.sql");
    if (!sql) {
      throw new Error("Query not authorized or not found: get_messages.sql");
    }
    return this.query(sql, [conversationId]);
  }

  /**
   * Gets messages similar to an embedding vector.
   * @async
   * @param {number[]} embedding - The embedding vector to compare against.
   * @param {string} conversationId - The conversation ID.
   * @param {number} limit - Maximum number of messages to return.
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getMessagesByEmbedding(embedding, conversationId, limit = 5) {
    const sql = await this.loadQuery("get_messages_by_embedding.sql");
    if (!sql) {
      throw new Error(
        "Query not authorized or not found: get_messages_by_embedding.sql",
      );
    }
    return this.query(sql, [embedding, conversationId, limit]);
  }

  /**
   * Updates a message's embedding.
   * @async
   * @param {string} messageId - The message ID.
   * @param {number[]} embedding - The embedding vector.
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async updateMessageEmbedding(messageId, embedding) {
    const sql = await this.loadQuery("update_message_embedding.sql");
    if (!sql) {
      throw new Error(
        "Query not authorized or not found: update_message_embedding.sql",
      );
    }
    return this.query(sql, [embedding, messageId]);
  }
}

export default MemoryManager;
