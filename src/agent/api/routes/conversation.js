import Route from "../../../lib/routes/route.js";
import { getMemoryClient } from "../../lib/memory/memory-client.js";
import { CustomBaseError, ErrorType } from "../errors/errors.js";

/**
 * Conversation route handler class
 * @class ConversationRoute
 * @extends Route
 */
class ConversationRoute extends Route {
  constructor(agentUserId) {
    super("/");
    this.agentUserId = agentUserId;
    this.memoryClient = getMemoryClient();
    this.setupRoutes();
  }

  /**
   * Set up conversation routes
   * @private
   */
  setupRoutes() {
    this.addRoutes(
      {
        method: "GET",
        url: "/conversations",
        schema: {
          description: "Get all conversations for the current user",
          response: {
            200: {
              description: "Conversations retrieved successfully",
              type: "object",
              properties: {
                conversations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      userIds: { type: "array", items: { type: "string" } },
                    },
                  },
                },
              },
            },
            500: {
              description: "Internal server error",
              type: "object",
              properties: {
                status: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
        handler: this.handleGetConversations.bind(this),
      },
      {
        method: "POST",
        url: "/conversations",
        schema: {
          description: "Create a new conversation",
          response: {
            200: {
              description: "Conversation created successfully",
              type: "object",
              properties: {
                conversationId: { type: "string" },
              },
            },
            500: {
              description: "Internal server error",
              type: "object",
              properties: {
                status: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
        handler: this.handleCreateConversation.bind(this),
      },
      {
        method: "DELETE",
        url: "/conversations/:conversationId",
        schema: {
          description: "Delete a conversation",
          params: {
            type: "object",
            required: ["conversationId"],
            properties: {
              conversationId: { type: "string" },
            },
          },
          response: {
            200: {
              description: "Conversation deleted successfully",
              type: "object",
              properties: {
                status: { type: "string" },
              },
            },
            500: {
              description: "Internal server error",
              type: "object",
              properties: {
                status: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
        handler: this.handleDeleteConversation.bind(this),
      }
    );
  }

  /**
   * Handle get conversations request
   * @private
   * @param {FastifyRequest} request - Fastify request object
   * @param {FastifyReply} reply - Fastify reply object
   */
  async handleGetConversations(request, reply) {
    try {
      const hostname = request.hostname;
      const { userId, error: userError } = await this.memoryClient.getOrCreateUser(hostname);

      if (userError) {
        throw new CustomBaseError(
          `Failed to get/create user: ${userError.message}`,
          ErrorType.BUSINESS_LOGIC,
          userError
        );
      }

      const { data: conversations, error: convError } = await this.memoryClient.getConversations(userId);

      if (convError) {
        throw new CustomBaseError(
          `Failed to get conversations: ${convError.message}`,
          ErrorType.BUSINESS_LOGIC,
          convError
        );
      }

      return { conversations };
    } catch (error) {
      if (error instanceof CustomBaseError) {
        throw error;
      }
      throw new CustomBaseError(
        "Failed to get conversations",
        ErrorType.UNKNOWN,
        error
      );
    }
  }

  /**
   * Handle create conversation request
   * @private
   * @param {FastifyRequest} request - Fastify request object
   * @param {FastifyReply} reply - Fastify reply object
   */
  async handleCreateConversation(request, reply) {
    try {
      const hostname = request.hostname;
      const { userId, error: userError } = await this.memoryClient.getOrCreateUser(hostname);

      if (userError) {
        throw new CustomBaseError(
          `Failed to get/create user: ${userError.message}`,
          ErrorType.BUSINESS_LOGIC,
          userError
        );
      }

      const { data, error: convError } = await this.memoryClient.createConversation([userId, this.agentUserId]);

      if (convError) {
        throw new CustomBaseError(
          `Failed to create conversation: ${convError.message}`,
          ErrorType.BUSINESS_LOGIC,
          convError
        );
      }

      return { conversationId: data.id };
    } catch (error) {
      if (error instanceof CustomBaseError) {
        throw error;
      }
      throw new CustomBaseError(
        "Failed to create conversation",
        ErrorType.UNKNOWN,
        error
      );
    }
  }

  /**
   * Handle delete conversation request
   * @private
   * @param {FastifyRequest} request - Fastify request object
   * @param {FastifyReply} reply - Fastify reply object
   */
  async handleDeleteConversation(request, reply) {
    try {
      const { conversationId } = request.params;
      const { error } = await this.memoryClient.deleteConversation(conversationId);

      if (error) {
        throw new CustomBaseError(
          `Failed to delete conversation: ${error.message}`,
          ErrorType.BUSINESS_LOGIC,
          error
        );
      }

      return { status: "success" };
    } catch (error) {
      if (error instanceof CustomBaseError) {
        throw error;
      }
      throw new CustomBaseError(
        "Failed to delete conversation",
        ErrorType.UNKNOWN,
        error
      );
    }
  }
}

export default ConversationRoute; 