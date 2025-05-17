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
}

export default ConversationsManager;
