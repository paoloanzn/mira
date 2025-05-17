import Route from "../../../lib/routes/route.js";

/**
 * Health check route handler class
 * @class HealthRoute
 * @extends Route
 */
class HealthRoute extends Route {
  constructor() {
    super("/");
    this.setupRoutes();
  }

  /**
   * Set up health check routes
   * @private
   */
  setupRoutes() {
    this.addRoutes({
      method: "GET",
      url: "/health",
      schema: {
        description: "Health check endpoint",
        response: {
          200: {
            description: "Service is healthy",
            type: "object",
            properties: {
              status: { type: "string" },
            },
          },
        },
      },
      handler: this.handleHealthCheck.bind(this),
    });
  }

  /**
   * Handle health check request
   * @private
   * @param {FastifyRequest} request - Fastify request object
   * @param {FastifyReply} reply - Fastify reply object
   */
  async handleHealthCheck(request, reply) {
    return { status: "ok" };
  }
}

export default HealthRoute;
