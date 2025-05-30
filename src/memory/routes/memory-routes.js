import Route from "../../lib/routes/route.js";
import UsersManager from "../db/users-manager.js";
import ConversationsManager from "../db/conversations-manager.js";
import MessagesManager from "../db/messages-manager.js";
import { logger } from "../../lib/logger/logger.js";

const memoryRoute = new Route("/memory");
const usersManager = new UsersManager();
const conversationsManager = new ConversationsManager();
const messagesManager = new MessagesManager();

const routes = [
  {
    method: "POST",
    url: "/users",
    schema: {
      description: "Create a new user",
      body: {
        type: "object",
        required: ["hostname"],
        properties: {
          hostname: { type: "string" },
          is_agent: { type: "boolean", default: false },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { hostname, is_agent = false } = request.body;
      const { data, error } = await usersManager.createUser(is_agent, hostname);
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }
      reply.send(data[0]);
    },
  },
  {
    method: "GET",
    url: "/users",
    schema: {
      description: "Get a user by various criteria",
      querystring: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          hostname: { type: "string" },
          is_agent: { type: "boolean" },
        },
        anyOf: [
          { required: ["id"] },
          { required: ["hostname"] },
          { required: ["is_agent"] },
        ],
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { id, hostname, is_agent } = request.query;
      const { data, error } = await usersManager.getUser({
        id,
        hostname,
        isAgent: is_agent,
      });

      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }
      if (!data || data.length === 0) {
        reply.status(404).send({ error: "User not found" });
        return;
      }
      reply.send(data[0]);
    },
  },
  {
    method: "POST",
    url: "/conversations",
    schema: {
      description: "Create a new conversation",
      body: {
        type: "object",
        properties: {
          userIds: {
            type: "array",
            items: { type: "string", format: "uuid" },
            minItems: 1,
          },
        },
        required: ["userIds"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { userIds } = request.body;
      const { data, error } =
        await conversationsManager.createConversation(userIds);
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }
      reply.send(data);
    },
  },
  {
    method: "GET",
    url: "/conversations/:conversationId/messages",
    schema: {
      description: "Get messages from a conversation",
      params: {
        type: "object",
        properties: {
          conversationId: { type: "string", format: "uuid" },
        },
        required: ["conversationId"],
      },
      querystring: {
        type: "object",
        properties: {
          embedding: {
            type: "array",
            items: { type: "number" },
            minItems: 384,
            maxItems: 384,
          },
          limit: { type: "integer", minimum: 1, maximum: 100, default: 5 },
        },
      },
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              content: { type: "string" },
              user_id: { type: "string", format: "uuid" },
              created_at: { type: "string", format: "date-time" },
              embedding: {
                type: "array",
                items: { type: "number" },
                nullable: true,
              },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { conversationId } = request.params;
      logger.debug(request, request.query);
      const { "embedding[]": embedding, limit } = request.query;
      logger.debug(embedding);
      const { data, error } = await messagesManager.getMessages({
        conversationId,
        embedding: embedding
          ? [...embedding.map((embedding) => parseFloat(embedding))]
          : null,
        limit,
      });
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }

      let parsedEmebedding = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].embedding && typeof data[i].embedding === "string") {
          // remove '[' and ']' and split by , into single values
          for (let value of data[i].embedding
            .substring(1, data[i].embedding.length - 1)
            .split(",")) {
            parsedEmebedding.push(parseFloat(value));
          }
          data[i].embedding = parsedEmebedding;
        }
      }

      reply.send(data);
    },
  },
  {
    method: "POST",
    url: "/conversations/:conversationId/messages",
    schema: {
      description: "Create a new message in a conversation",
      params: {
        type: "object",
        properties: {
          conversationId: { type: "string", format: "uuid" },
        },
        required: ["conversationId"],
      },
      body: {
        type: "object",
        properties: {
          userId: { type: "string", format: "uuid" },
          content: { type: "string", minLength: 1 },
          embedding: {
            type: "array",
            items: { type: "number" },
            minItems: 384,
            maxItems: 384,
          },
        },
        required: ["userId", "content"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { conversationId } = request.params;
      const { userId, content, embedding } = request.body;
      const { data, error } = await messagesManager.createMessage(
        conversationId,
        userId,
        content,
        [...embedding],
      );
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }
      reply.send(data[0]);
    },
  },
  {
    method: "PUT",
    url: "/messages/:messageId/embedding",
    schema: {
      description: "Update a message's embedding",
      params: {
        type: "object",
        properties: {
          messageId: { type: "string", format: "uuid" },
        },
        required: ["messageId"],
      },
      body: {
        type: "object",
        properties: {
          embedding: {
            type: "array",
            items: { type: "number" },
            minItems: 384,
            maxItems: 384,
          },
        },
        required: ["embedding"],
      },
    },
    handler: async (request, reply) => {
      const { messageId } = request.params;
      const { embedding } = request.body;
      const { error } = await messagesManager.updateMessageEmbedding(
        messageId,
        embedding,
      );
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }
      reply.status(204).send();
    },
  },
  {
    method: "GET",
    url: "/conversations",
    schema: {
      description: "Get all conversations for a user",
      querystring: {
        type: "object",
        required: ["userId"],
        properties: {
          userId: { type: "string", format: "uuid" },
        },
      },
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              created_at: { type: "string", format: "date-time" },
              user_ids: {
                type: "array",
                items: { type: "string", format: "uuid" },
              },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { userId } = request.query;
      const { data, error } =
        await conversationsManager.getConversations(userId);
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }
      reply.send(data);
    },
  },
  {
    method: "DELETE",
    url: "/conversations/:conversationId",
    schema: {
      description: "Delete a conversation and all its messages",
      params: {
        type: "object",
        required: ["conversationId"],
        properties: {
          conversationId: { type: "string", format: "uuid" },
        },
      },
      response: {
        204: {
          description: "Conversation deleted successfully",
        },
      },
    },
    handler: async (request, reply) => {
      const { conversationId } = request.params;
      const { error } =
        await conversationsManager.deleteConversation(conversationId);
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }
      reply.status(204).send();
    },
  },
];

memoryRoute.addRoutes(...routes);

export default memoryRoute;
