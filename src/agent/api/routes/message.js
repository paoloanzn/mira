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
    this.addRoutes({
      method: "POST",
      url: "/message",
      schema: {
        description: "Send a message to the agent",
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
    });
  }

  /**
   * Creates a new agent loop for message processing
   * @private
   * @param {string} content - The message content
   * @param {string} conversationId - The conversation ID
   * @param {PassThrough} responseStream - The response stream
   * @returns {AgentLoop} The created agent loop
   */
  #createMessageLoop(content, conversationId, responseStream) {
    return new AgentLoop(
      `Handle the user request: ${content}`,
      async (task) => {
        // Get conversation history
        const { data: messages, error: historyError } =
          await this.memoryClient.getMessages(conversationId);
        if (historyError) {
          throw new Error(`Failed to get messages: ${historyError.message}`);
        }

        // Format conversation for template
        const formattedConversation = this.memoryClient.formatConversation(
          messages,
          this.agentUserId,
        );

        // Compile template with conversation
        const { template, error: templateError } = compileTemplate(chatTemplate, {
          conversation: formattedConversation,
          userQuery: task
        });

        if (templateError) {
          throw new Error(`Template compilation failed: ${templateError}`);
        }

        // Generate AI response
        let aiResponse = "";
        const { error: generateError } = await generateText(
          template,
          ModelProvider.OPENAI,
          ({chunk}) => {
            switch(chunk.type){
              case "text-delta":
                aiResponse += chunk.textDelta;
                responseStream.write(
                  `0:"${chunk.textDelta.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`,
                );
                break;
              case "tool-call-streaming-part":
                responseStream.write(
                  `b:${JSON.stringify({toolCallId: chunk.toolCallId, toolName: chunk.toolName})}\n`,
                )
                break;
              case "tool-call":
                responseStream.write(
                  `9:${JSON.stringify({toolCallId: chunk.toolCallId, toolName: chunk.toolName, args: chunk.args})}\n`,
                )
              case "tool-result":
                responseStream.write(
                  `a:${JSON.stringify({toolCallId: chunk.toolCallId, result: chunk.result})}\n`,
                )
              default:
                break;
            }
          },
          ModelType.MEDIUM,
          tools,
          5,
        );

        if (generateError) {
          throw new Error(`Text generation failed: ${generateError}`);
        }

        return aiResponse.trim();
      },
      async (state) => {
        // Save AI response on success
        const { error: saveError } = await this.memoryClient.createMessage(
          conversationId,
          this.agentUserId,
          state.result,
        );
        if (saveError) {
          throw new Error(`Failed to save AI response: ${saveError.message}`);
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
      }
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
    const hostname = request.hostname;

    if (!content) {
      reply.status(400).send({
        status: "error",
        message: "Missing content",
      });
      return;
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
        throw new Error(`Failed to get/create user: ${userError.message}`);
      }

      // Get or create conversation for this user
      const { conversationId, error: convError } =
        await this.memoryClient.getOrCreateConversation(
          userId,
          this.agentUserId,
        );
      if (convError) {
        throw new Error(
          `Failed to get/create conversation: ${convError.message}`,
        );
      }

      // Add user message
      const { error: msgError } = await this.memoryClient.createMessage(
        conversationId,
        userId,
        content,
      );
      if (msgError) {
        throw new Error(`Failed to create message: ${msgError.message}`);
      }

      // Create and execute agent loop
      const loop = this.#createMessageLoop(content, conversationId, responseStream);
      await loop.execute();

    } catch (error) {
      console.error("Error processing message:", error);
      if (!responseStream.writableEnded) {
        responseStream.write(
          `event: error\ndata: ${JSON.stringify({
            message: "Internal server error",
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
