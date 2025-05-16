import * as path from "path";

/**
 * Class representing a collection of Fastify routes with schema generation capabilities.
 * @class Route
 */
class Route {
  /**
   * Create a Route instance.
   * @constructor
   * @param {string} [rootUrl="/"] - The root URL for all routes.
   */
  constructor(rootUrl = "/") {
    this.rootUrl = rootUrl;
    this.routes = [];
  }

  /**
   * Add one or more routes with schema definitions.
   * @param {...Object} routes - Route objects
   * @param {string} routes[].method - HTTP method
   * @param {string} routes[].url - Route URL path
   * @param {Object} [routes[].schema] - Route schema definition
   * @param {string} [routes[].description] - Route description
   * @param {Function} [routes[].preHandler] - Optional pre-handler function
   * @param {Function} routes[].handler - Route handler function
   */
  addRoutes(...routes) {
    routes.forEach(({ method, url, schema, description, preHandler, handler }) => {
      const fullUrl = path.join(this.rootUrl, url);
      const route = { 
        method, 
        url: fullUrl, 
        handler,
        schema: schema || {},
      };

      if (description) {
        route.schema.description = description;
      }

      if (preHandler) {
        route.preHandler = preHandler;
      }

      this.routes.push(route);
    });
  }

  /**
   * Return an array of Fastify route definitions.
   * @returns {Object[]} The list of registered routes
   */
  getRoutes() {
    return this.routes;
  }

  /**
   * Generate OpenAPI schema for all routes.
   * @returns {Object} OpenAPI schema object
   */
  generateSchema() {
    return this.routes.reduce((schema, route) => {
      const pathKey = route.url.replace(/\/:([^/]+)/g, "/{$1}"); // Convert :param to {param} format
      
      schema.paths[pathKey] = schema.paths[pathKey] || {};
      schema.paths[pathKey][route.method.toLowerCase()] = {
        description: route.schema.description || "",
        parameters: this._extractParameters(route),
        requestBody: this._extractRequestBody(route),
        responses: this._extractResponses(route)
      };

      return schema;
    }, {
      openapi: "3.0.0",
      info: {
        title: "Memory Service API",
        version: "1.0.0"
      },
      paths: {}
    });
  }

  /**
   * Extract OpenAPI parameters from route schema.
   * @private
   * @param {Object} route - Route object
   * @returns {Array} Array of parameter objects
   */
  _extractParameters(route) {
    const params = [];
    
    // URL parameters
    if (route.schema.params) {
      Object.entries(route.schema.params.properties || {}).forEach(([name, schema]) => {
        params.push({
          name,
          in: "path",
          required: true,
          schema
        });
      });
    }

    // Query parameters
    if (route.schema.querystring) {
      Object.entries(route.schema.querystring.properties || {}).forEach(([name, schema]) => {
        params.push({
          name,
          in: "query",
          required: (route.schema.querystring.required || []).includes(name),
          schema
        });
      });
    }

    return params;
  }

  /**
   * Extract OpenAPI request body from route schema.
   * @private
   * @param {Object} route - Route object
   * @returns {Object|undefined} Request body schema
   */
  _extractRequestBody(route) {
    if (!route.schema.body) return undefined;

    return {
      required: true,
      content: {
        "application/json": {
          schema: route.schema.body
        }
      }
    };
  }

  /**
   * Extract OpenAPI responses from route schema.
   * @private
   * @param {Object} route - Route object
   * @returns {Object} Response schemas
   */
  _extractResponses(route) {
    const responses = {
      "200": {
        description: "Successful response",
        content: {}
      }
    };

    if (route.schema.response) {
      Object.entries(route.schema.response).forEach(([code, schema]) => {
        responses[code] = {
          description: schema.description || "Response",
          content: {
            "application/json": {
              schema
            }
          }
        };
      });
    }

    return responses;
  }

  /**
   * Register all routes with the Fastify instance.
   * @param {Fastify} fastify - The Fastify instance.
   */
  register(fastify) {
    this.getRoutes().forEach((route) => fastify.route(route));
  }
}

export default Route; 