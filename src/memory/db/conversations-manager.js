import BaseManager from "./base-manager.js";

/**
 * Manager for conversation-related database operations.
 * @class ConversationsManager
 * @extends BaseManager
 */
class ConversationsManager extends BaseManager {
  /**
   * Creates a new conversation and adds users to it.
   * @async
   * @param {string[]} userIds - Array of user IDs to add to the conversation
   * @returns {Promise<{data: {id: string}|null, error: Error|null}>}
   */
  async createConversation(userIds) {
    return this.transaction(async (client) => {
      // Create conversation
      const createConvSql = await this.loadAndValidateQuery(
        "create_conversation.sql",
      );
      const {
        rows: [conversation],
      } = await client.query(createConvSql);

      // Add users to conversation
      const addUserSql = await this.loadAndValidateQuery(
        "add_user_to_conversation.sql",
      );
      await Promise.all(
        userIds.map((userId) =>
          client.query(addUserSql, [conversation.id, userId]),
        ),
      );

      return conversation;
    });
  }

  /**
   * Gets all conversations for a user.
   * @async
   * @param {string} userId - The user ID to get conversations for
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getConversations(userId) {
    try {
      const sql = await this.loadAndValidateQuery("get_conversations.sql");
      return await this.query(sql, [userId]);
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Deletes a conversation and all its related data.
   * @async
   * @param {string} conversationId - The ID of the conversation to delete
   * @returns {Promise<{data: null, error: Error|null}>}
   */
  async deleteConversation(conversationId) {
    try {
      const sql = await this.loadAndValidateQuery("delete_conversation.sql");
      return await this.query(sql, [conversationId]);
    } catch (error) {
      return { data: null, error };
    }
  }
}

export default ConversationsManager;
