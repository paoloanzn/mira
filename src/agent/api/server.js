import Fastify from "fastify";
import MessageRoute from "./routes/message.js";
import HealthRoute from "./routes/health.js";
import ConversationRoute from "./routes/conversation.js";
import UserRoute from "./routes/user.js";
import ConfigRoute from "./routes/config.js";

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

  try {
    // Register routes
    const messageRoute = new MessageRoute(agentUserId);
    const healthRoute = new HealthRoute();
    const conversationRoute = new ConversationRoute(agentUserId);
    const userRoute = new UserRoute();
    const configRoute = new ConfigRoute();

    messageRoute.register(fastify);
    healthRoute.register(fastify);
    conversationRoute.register(fastify);
    userRoute.register(fastify);
    configRoute.register(fastify);

    // Start server
    await fastify.listen(serverConfig);
    console.log(
      `Agent API server running on ${JSON.stringify(fastify.server.address())}`,
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    throw error;
  }
}
