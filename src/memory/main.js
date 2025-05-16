import Fastify from "fastify";
import cors from "@fastify/cors";
import memoryRoute from "./routes/memory-routes.js";
import process from "node:process";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "development") {
    dotenv.config()
    console.log(process.env)
}

const serverConfig = {
  port: 8081, // Different from agent service port
  host: "0.0.0.0",
};

// Allow requests from agent service
const allowedOrigins = Object.freeze([
  "localhost",
  "172.20.0.1",
  "agent-service", // This must be set by the agent-service in the origin header 
]);

const corsOriginPolicy = (origin, cb) => {
  // When running tests origin headers is undefined
  if (process.env.NODE_ENV === "development" && !origin) {
    cb(null, true);
    return;
  }

  const hostname = new URL(origin).hostname;
  if (allowedOrigins.includes(hostname)) {
    cb(null, true);
    return;
  }

  cb(new Error("Not allowed"), false);
};

const start = async () => {
  dotenv.config()
  const fastify = Fastify({
    logger: true,//process.env.NODE_ENV === "development",
  });

  // Register CORS
  //await fastify.register(cors, {
    //origin: corsOriginPolicy,
    //methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  //});

  // Register routes
  memoryRoute.register(fastify);

  // Add schema endpoint that returns OpenAPI schema
  fastify.get("/schema", {
    schema: {
      description: "Get OpenAPI schema for all endpoints",
      response: {
        200: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    handler: () => memoryRoute.generateSchema(),
  });

  // Add health check endpoint
  fastify.get("/health", {
    schema: {
      description: "Health check endpoint",
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string" },
            timestamp: { type: "string", format: "date-time" }
          }
        }
      }
    },
    handler: () => ({
      status: "ok",
      timestamp: new Date().toISOString()
    })
  });

  try {
    await fastify.listen({
      port: process.env.MEMORY_PORT || serverConfig.port,
      host: serverConfig.host,
    });
    console.log(
      `Memory service running on ${JSON.stringify(fastify.server.address())}`,
    );
  } catch (error) {
    console.error(error.stack);
    process.exit(1);
  }
};

start(); 