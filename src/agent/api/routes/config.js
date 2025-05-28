import Route from "../../../lib/routes/route.js";
import {
  updateEnvVariable,
  getEnvVariable,
} from "../../../lib/utils/envManager.js";
import { CustomBaseError, ErrorType } from "../errors/errors.js";

/**
 * Configuration route handler class
 * @class ConfigRoute
 * @extends Route
 */
class ConfigRoute extends Route {
  constructor() {
    super("/");
    this.setupRoutes();
  }

  /**
   * Set up configuration routes
   * @private
   */
  setupRoutes() {
    this.addRoutes(
      {
        method: "GET",
        url: "/config/:key",
        schema: {
          description: "Get configuration value",
          params: {
            type: "object",
            required: ["key"],
            properties: {
              key: { type: "string" },
            },
          },
          response: {
            200: {
              description: "Configuration value retrieved successfully",
              type: "object",
              properties: {
                value: { type: "string" },
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
        handler: this.handleGetConfig.bind(this),
      },
      {
        method: "POST",
        url: "/config/:key",
        schema: {
          description: "Update configuration value",
          params: {
            type: "object",
            required: ["key"],
            properties: {
              key: { type: "string" },
            },
          },
          body: {
            type: "object",
            required: ["value"],
            properties: {
              value: { type: "string" },
            },
          },
          response: {
            200: {
              description: "Configuration value updated successfully",
              type: "object",
              properties: {
                status: { type: "string" },
                message: { type: "string" },
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
        handler: this.handleUpdateConfig.bind(this),
      },
    );
  }

  /**
   * Handle get configuration request
   * @private
   * @param {FastifyRequest} request - Fastify request object
   * @param {FastifyReply} reply - Fastify reply object
   */
  async handleGetConfig(request, reply) {
    try {
      const { key } = request.params;
      const value = await getEnvVariable(key);
      return { value };
    } catch (error) {
      if (error instanceof CustomBaseError) {
        throw error;
      }
      throw new CustomBaseError(
        "Failed to get configuration",
        ErrorType.UNKNOWN,
        error,
      );
    }
  }

  /**
   * Handle update configuration request
   * @private
   * @param {FastifyRequest} request - Fastify request object
   * @param {FastifyReply} reply - Fastify reply object
   */
  async handleUpdateConfig(request, reply) {
    try {
      const { key } = request.params;
      const { value } = request.body;

      if (!value) {
        throw new CustomBaseError("Value is required", ErrorType.VALIDATION);
      }

      await updateEnvVariable(key, value);
      return {
        status: "success",
        message: "Configuration updated successfully",
      };
    } catch (error) {
      if (error instanceof CustomBaseError) {
        throw error;
      }
      throw new CustomBaseError(
        "Failed to update configuration",
        ErrorType.UNKNOWN,
        error,
      );
    }
  }
}

export default ConfigRoute;
