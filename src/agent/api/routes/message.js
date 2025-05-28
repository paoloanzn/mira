import { PassThrough } from "stream";
import {
  generateText,
  ModelProvider,
  ModelType,
} from "../../lib/ai/provider.js";
import { getMemoryClient } from "../../lib/memory/memory-client.js";
import { compileTemplate } from "../../lib/ai/template-compiler.js";
import { chatTemplate } from "../../lib/ai/templates.js";
import { tools } from "../../lib/ai/tools.js";
import Route from "../../../lib/routes/route.js";
import { AgentLoop } from "../../lib/loop/agent-loop.js";
import { getEmbeddingManager } from "../../lib/ai/embedding.js";
import { logger } from "../../../lib/logger/logger.js";
import { CustomBaseError, ErrorType } from "../errors/errors.js";

/**
 * Message route handler class
 * @class MessageRoute
 * @extends Route
 */
class MessageRoute extends Route {
  constructor(agentUserId) {
    super("/");
    this.agentUserId = agentUserId;
    this.memoryClient = getMemoryClient();
    this.setupRoutes();
  }

  /**
   * Set up message routes
   * @private
   */
  setupRoutes() {
    this.addRoutes(
      {
        method: "GET",
        url: "/conversations/:conversationId/messages",
        schema: {
          description: "Get messages for a conversation",
          params: {
            type: "object",
            required: ["conversationId"],
            properties: {
              conversationId: { type: "string" },
            },
          },
          response: {
            200: {
              description: "Messages retrieved successfully",
              type: "object",
              properties: {
                messages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      userId: { type: "string" },
                      content: { type: "string" },
                      created_at: { type: "string" },
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
        handler: this.handleGetMessages.bind(this),
      },
      {
        method: "POST",
        url: "/conversations/:conversationId/messages",
        schema: {
          description: "Send a message to the agent",
          params: {
            type: "object",
            required: ["conversationId"],
            properties: {
              conversationId: { type: "string" },
            },
          },
          body: {
            type: "object",
            required: ["content"],
            properties: {
              content: { type: "string" },
            },
          },
          response: {
            200: {
              description: "Message processed successfully",
              type: "object",
              properties: {
                status: { type: "string" },
                data: { type: "object" },
              },
            },
            400: {
              description: "Bad request",
              type: "object",
              properties: {
                status: { type: "string" },
                message: { type: "string" },
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
        handler: this.handleMessage.bind(this),
      }
    );
  }

  /**
   * Handle get messages request
   * @private
   * @param {FastifyRequest} request - Fastify request object
   * @param {FastifyReply} reply - Fastify reply object
   */
  async handleGetMessages(request, reply) {
    try {
      const { conversationId } = request.params;
      const { data: messages, error } = await this.memoryClient.getMessages(conversationId);

      if (error) {
        throw new CustomBaseError(
          `Failed to get messages: ${error.message}`,
          ErrorType.BUSINESS_LOGIC,
          error
        );
      }

      return { messages };
    } catch (error) {
      if (error instanceof CustomBaseError) {
        throw error;
      }
      throw new CustomBaseError(
        "Failed to get messages",
        ErrorType.UNKNOWN,
        error
      );
    }
  }

  /**
   * Creates a new agent loop for message processing
   * @private
   * @param {string} content - The message content
   * @param {number[]} embedding - Message embeddings
   * @param {string} conversationId - The conversation ID
   * @param {PassThrough} responseStream - The response stream
   * @returns {AgentLoop} The created agent loop
   */
  #createMessageLoop(content, embedding, conversationId, responseStream) {
    return new AgentLoop(
      `Handle the user request: ${content}`,
      async (task) => {
        // Get conversation history
        const { data: messages, error: historyError } =
          await this.memoryClient.getMessages(conversationId);
        if (historyError) {
          throw new CustomBaseError(
            `Failed to get messages: ${historyError.message}`,
            ErrorType.BUSINESS_LOGIC,
            historyError
          );
        }

        const { data: similarMessages, error: similaritySearchError } =
          await this.memoryClient.getMessages(conversationId, {
            embedding,
            limit: 5,
          });
        if (similaritySearchError) {
          throw new CustomBaseError(
            `Failed to get similarity search results from messages: ${similaritySearchError.message}`,
            ErrorType.BUSINESS_LOGIC,
            similaritySearchError
          );
        }

        // Format conversation for template
        const formattedConversation = this.memoryClient.formatConversation(
          messages,
          this.agentUserId,
        );

        // Compile template with conversation
        const { template, error: templateError } = compileTemplate(
          chatTemplate,
          {
            conversation: formattedConversation,
            userQuery: task,
            similarMessages:
              this.memoryClient.formatConversation(similarMessages),
          },
        );

        logger.debug(template);

        if (templateError) {
          throw new CustomBaseError(
            `Template compilation failed: ${templateError}`,
            ErrorType.BUSINESS_LOGIC
          );
        }

        // Generate AI response
        let aiResponse = "";
        const { error: generateError } = await generateText(
          template,
          ModelProvider.OPENAI,
          ({ chunk }) => {
            switch (chunk.type) {
              case "text-delta":
                aiResponse += chunk.textDelta;
                responseStream.write(
                  `0:"${chunk.textDelta.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"\n`,
                );
                break;
              case "tool-call-streaming-part":
                responseStream.write(
                  `b:${JSON.stringify({ toolCallId: chunk.toolCallId, toolName: chunk.toolName })}\n`,
                );
                break;
              case "tool-call":
                responseStream.write(
                  `9:${JSON.stringify({ toolCallId: chunk.toolCallId, toolName: chunk.toolName, args: chunk.args })}\n`,
                );
              case "tool-result":
                responseStream.write(
                  `a:${JSON.stringify({ toolCallId: chunk.toolCallId, result: chunk.result })}\n`,
                );
              default:
                break;
            }
          },
          ModelType.MEDIUM,
          tools,
          5,
        );

        if (generateError) {
          throw new CustomBaseError(
            `Text generation failed: ${generateError}`,
            ErrorType.BUSINESS_LOGIC,
            generateError
          );
        }

        return aiResponse.trim();
      },
      async (state) => {
        // Save AI response on success
        // Generate embedding for agent response
        const embeddingManager = getEmbeddingManager();
        const agentEmbedding = await embeddingManager.generateEmbeddings(
          state.result,
        );

        // Save AI response with embedding
        const { error: saveError } = await this.memoryClient.createMessage(
          conversationId,
          this.agentUserId,
          state.result,
          agentEmbedding,
        );
        if (saveError) {
          throw new CustomBaseError(
            `Failed to save AI response: ${saveError.message}`,
            ErrorType.BUSINESS_LOGIC,
            saveError
          );
        }
      },
      async (state) => {
        // Handle error
        if (!responseStream.writableEnded) {
          responseStream.write(
            `event: error\ndata: ${JSON.stringify({
              message: state.result || "Internal server error",
            })}\n\n`,
          );
        }
      },
    );
  }

  /**
   * Handle incoming message
   * @private
   * @param {FastifyRequest} request - Fastify request object
   * @param {FastifyReply} reply - Fastify reply object
   */
  async handleMessage(request, reply) {
    const { content } = request.body;
    const { conversationId } = request.params;
    const hostname = request.hostname;

    if (!content) {
      throw new CustomBaseError(
        "Missing content",
        ErrorType.VALIDATION
      );
    }

    // Set SSE headers for streaming
    reply
      .header("Content-Type", "text/event-stream")
      .header("Cache-Control", "no-cache")
      .header("Connection", "keep-alive");

    const responseStream = new PassThrough();
    reply.send(responseStream);

    try {
      // Get or create user for this hostname
      const { userId, error: userError } =
        await this.memoryClient.getOrCreateUser(hostname);
      if (userError) {
        throw new CustomBaseError(
          `Failed to get/create user: ${userError.message}`,
          ErrorType.BUSINESS_LOGIC,
          userError
        );
      }

      // Generate embedding for user message
      const embeddingManager = getEmbeddingManager();
      const userEmbedding = await embeddingManager.generateEmbeddings(content);

      // Add user message with embedding
      const { error: msgError } = await this.memoryClient.createMessage(
        conversationId,
        userId,
        content,
        userEmbedding,
      );
      if (msgError) {
        throw new CustomBaseError(
          `Failed to create message: ${msgError.message}`,
          ErrorType.BUSINESS_LOGIC,
          msgError
        );
      }

      // Create and execute agent loop
      const loop = this.#createMessageLoop(
        content,
        userEmbedding,
        conversationId,
        responseStream,
      );
      await loop.execute();
    } catch (error) {
      console.error("Error processing message:", error);
      if (!responseStream.writableEnded) {
        responseStream.write(
          `event: error\ndata: ${JSON.stringify({
            message: error instanceof CustomBaseError ? error.message : "Internal server error",
          })}\n\n`,
        );
      }
    } finally {
      if (!responseStream.writableEnded) {
        responseStream.end();
      }
    }
  }
}

export default MessageRoute;
