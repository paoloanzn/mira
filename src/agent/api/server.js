import Fastify from "fastify";
import { PassThrough } from "stream";
import { generateText, ModelProvider, ModelType } from "../lib/ai/provider.js";
import { getUserManager } from "../lib/memory/user-manager.js";
import { getConversationManager } from "../lib/memory/conversation-manager.js";
import { compileTemplate } from "../lib/ai/template-compiler.js";
import { chatTemplate } from "../lib/ai/templates.js";
import { tools } from "../lib/ai/tools.js";

const serverConfig = {
  port: process.env.AGENT_PORT || 8080,
  host: "0.0.0.0",
};

/**
 * Starts the Fastify server for the agent API
 * @param {string} agentUserId - The agent's user ID
 */
export async function startServer(agentUserId) {
  const fastify = Fastify({
    logger: process.env.NODE_ENV === "development",
  });

  // Get manager instances
  const userManager = getUserManager();
  const conversationManager = getConversationManager();

  // Health check endpoint
  fastify.get("/health", async () => {
    return { status: "ok" };
  });

  // Message endpoint
  fastify.post("/message", async (request, reply) => {
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
        await userManager.getOrCreateUser(hostname);
      if (userError) {
        throw new Error(`Failed to get/create user: ${userError.message}`);
      }

      // Get or create conversation for this user
      const { conversationId, error: convError } =
        await conversationManager.getOrCreateConversation(userId, agentUserId);
      if (convError) {
        throw new Error(
          `Failed to get/create conversation: ${convError.message}`,
        );
      }

      // Add user message
      await conversationManager.addMessage(conversationId, userId, content);

      // Get conversation history
      const { messages, error: msgError } =
        await conversationManager.getMessages(conversationId);
      if (msgError) {
        throw new Error(`Failed to get messages: ${msgError.message}`);
      }

      // Format conversation for template
      const formattedConversation = conversationManager.formatConversation(
        messages,
        agentUserId,
      );

      // Compile template with conversation
      const { template, error: templateError } = compileTemplate(chatTemplate, {
        conversation: formattedConversation,
      });

      if (templateError) {
        throw new Error(`Template compilation failed: ${templateError}`);
      }

      // Generate and stream AI response
      let aiResponse = "";
      const { steps, error: generateError } = await generateText(
        template,
        ModelProvider.OPENAI,
        (textPart) => {
          aiResponse += textPart;
          responseStream.write(
            `data: ${JSON.stringify({ text: textPart })}\n\n`,
          );
        },
        ModelType.MEDIUM,
        tools,
      );

      if (generateError) {
        throw new Error(`Text generation failed: ${generateError}`);
      }

      // Save AI response
      await conversationManager.addMessage(
        conversationId,
        agentUserId,
        aiResponse.trim(),
      );
      console.log("STEPS:", JSON.stringify(steps, null, 2));
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
  });

  try {
    await fastify.listen(serverConfig);
    console.log(
      `Agent API server running on ${JSON.stringify(fastify.server.address())}`,
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    throw error;
  }
}
