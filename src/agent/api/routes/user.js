import Route from "../../../lib/routes/route.js";
import { getMemoryClient } from "../../lib/memory/memory-client.js";
import { CustomBaseError, ErrorType } from "../errors/errors.js";

/**
 * User route handler class
 * @class UserRoute
 * @extends Route
 */
class UserRoute extends Route {
  constructor() {
    super("/");
    this.memoryClient = getMemoryClient();
    this.setupRoutes();
  }

  /**
   * Set up user routes
   * @private
   */
  setupRoutes() {
    this.addRoutes({
      method: "GET",
      url: "/user",
      schema: {
        description: "Get user ID for the current hostname",
        response: {
          200: {
            description: "User ID retrieved successfully",
            type: "object",
            properties: {
              userId: { type: "string" },
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
      handler: this.handleGetUser.bind(this),
    });
  }

  /**
   * Handle get user request
   * @private
   * @param {FastifyRequest} request - Fastify request object
   * @param {FastifyReply} reply - Fastify reply object
   */
  async handleGetUser(request, reply) {
    try {
      const hostname = request.hostname;
      const { userId, error } = await this.memoryClient.getOrCreateUser(hostname);

      if (error) {
        throw new CustomBaseError(
          `Failed to get/create user: ${error.message}`,
          ErrorType.BUSINESS_LOGIC,
          error
        );
      }

      return { userId };
    } catch (error) {
      if (error instanceof CustomBaseError) {
        throw error;
      }
      throw new CustomBaseError(
        "Failed to get user",
        ErrorType.UNKNOWN,
        error
      );
    }
  }
}

export default UserRoute; 