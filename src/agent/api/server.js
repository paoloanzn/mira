import Fastify from "fastify";
import MessageRoute from "./routes/message.js";
import HealthRoute from "./routes/health.js";

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

    messageRoute.register(fastify);
    healthRoute.register(fastify);

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
