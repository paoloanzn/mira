import Route from "./route.js";
import MemoryManager from "../db/memory-manager.js";

const memoryRoute = new Route("/memory");
const memoryManager = new MemoryManager();

const routes = [
  {
    method: "POST",
    url: "/users",
    schema: {
      description: "Create a new user",
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
      const { data, error } = await memoryManager.createUser();
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }
      reply.send(data[0]);
    },
  },
  {
    method: "GET",
    url: "/users/:userId",
    schema: {
      description: "Get a user by ID",
      params: {
        type: "object",
        properties: {
          userId: { type: "string", format: "uuid" },
        },
        required: ["userId"],
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
      const { userId } = request.params;
      const { data, error } = await memoryManager.getUser(userId);
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }
      if (!data) {
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
      const { data, error } = await memoryManager.createConversation(userIds);
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
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
      const { userId, content } = request.body;
      const { data, error } = await memoryManager.createMessage(
        conversationId,
        userId,
        content,
      );
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }
      reply.send(data[0]);
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
      const { data, error } = await memoryManager.getMessages(conversationId);
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }
      reply.send(data);
    },
  },
  {
    method: "POST",
    url: "/conversations/:conversationId/messages/similar",
    schema: {
      description: "Get messages similar to an embedding vector",
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
          limit: { type: "integer", minimum: 1, maximum: 100, default: 5 },
        },
      },
      body: {
        type: "object",
        properties: {
          embedding: {
            type: "array",
            items: { type: "number" },
            minItems: 1536,
            maxItems: 1536,
          },
        },
        required: ["embedding"],
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
              similarity: { type: "number" },
              created_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { conversationId } = request.params;
      const { limit = 5 } = request.query;
      const { embedding } = request.body;
      const { data, error } = await memoryManager.getMessagesByEmbedding(
        embedding,
        conversationId,
        limit,
      );
      if (error) {
        reply.status(500).send({ error: error.message });
        return;
      }
      reply.send(data);
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
            minItems: 1536,
            maxItems: 1536,
          },
        },
        required: ["embedding"],
      },
    },
    handler: async (request, reply) => {
      const { messageId } = request.params;
      const { embedding } = request.body;
      const { error } = await memoryManager.updateMessageEmbedding(
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
];

memoryRoute.addRoutes(...routes);

export default memoryRoute;
