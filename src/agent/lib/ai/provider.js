/**
 * @module provider
 * Provides functionality to generate text using different AI providers.
 * Currently supports the OpenAI provider.
 */

import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import process from "node:process";
import { AIGenerationError, ErrorType, withRetries } from "./errors.js";

/**
 * Enum for supported AI service providers.
 * @readonly
 * @enum {string}
 */
export const ModelProvider = Object.freeze({
  OPENAI: "openai",
  GOOGLE: "google",
  ANTHROPIC: "anthropic",
  GROK: "grok",
});

/**
 * Enum for AI model sizes.
 * @readonly
 * @enum {string}
 */
export const ModelType = Object.freeze({
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
});

/**
 * Map of providers to their corresponding models based on size.
 * @readonly
 * @enum {Object}
 */
export const Models = Object.freeze({
  [ModelProvider.OPENAI]: {
    [ModelType.SMALL]: "gpt-4.1-nano",
    [ModelType.MEDIUM]: "gpt-4.1",
    [ModelType.LARGE]: "gpt-4.5",
  },
});

/**
 * Default configuration for text generation.
 * @readonly
 * @type {Object}
 * @property {number} temperature - Sampling temperature.
 * @property {number} maxInputTokens - Maximum input tokens.
 * @property {number} maxOutputTokens - Maximum output tokens.
 * @property {number} presencePenalty - Presence penalty.
 * @property {number} frequencyPenalty - Frequency penalty.
 * @property {number} maxSteps - Maximum number of tool execution steps.
 */
const defaultConfig = Object.freeze({
  temperature: 0.7,
  maxInputTokens: 200 * 1000,
  maxOutputTokens: 8 * 1000,
  presencePenalty: 0.01,
  frequencyPenalty: 0.01,
  maxSteps: 5,
});

/**
 * Handles the streaming of text from the AI model
 * @private
 * @async
 * @param {AsyncIterator} textStream - The text stream to process
 * @param {function} [streamCallback] - Optional callback for streaming chunks
 * @returns {Promise<string>} The complete generated text
 */
async function handleTextStream(textStream, streamCallback = null) {
  let result = "";
  try {
    for await (const textPart of textStream) {
      if (streamCallback) {
        streamCallback(textPart);
      }
      result += textPart;
    }
    return result;
  } catch (error) {
    throw new AIGenerationError(
      "Error during text stream processing",
      ErrorType.STREAM_GENERATION,
      error,
    );
  }
}

/**
 * Generates text using the specified AI provider.
 *
 * @async
 * @function generateText
 * @param {string} prompt - The prompt to send to the AI.
 * @param {string} provider - The AI provider to use (e.g., ModelProvider.OPENAI).
 * @param {function} [streamCallback] - Optional callback that receives chunks of streamed text.
 * @param {string} [modelSize=ModelType.MEDIUM] - The size of the AI model to use.
 * @param {Object} [tools={}] - Optional tools that the model can use during generation.
 * @param {number} [maxSteps] - Optional maximum number of tool execution steps.
 * @returns {Promise<{ data: string|null, steps: Array|null, error: (Error|string|null) }>} Result object containing either the generated text, execution steps (if tools were used), or an error.
 */
export async function generateText(
  prompt,
  provider,
  streamCallback = null,
  modelSize = ModelType.MEDIUM,
  tools = {},
  maxSteps = defaultConfig.maxSteps,
) {
  switch (provider) {
    case ModelProvider.OPENAI: {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new AIGenerationError(
          "OPENAI_API_KEY not found",
          ErrorType.VALIDATION,
        );
      }

      return await withRetries(async () => {
        try {
          const openai = createOpenAI({
            apiKey,
            compatibility: "strict",
          });

          const { textStream, steps } = await streamText({
            model: openai(Models[provider][modelSize]),
            prompt,
            tools,
            maxSteps,
            ...defaultConfig,
          });

          const result = await handleTextStream(textStream, streamCallback);
          return { data: result, steps, error: null };
        } catch (error) {
          // Convert known error types to AIGenerationError
          if (error instanceof AIGenerationError) {
            throw error;
          }

          // Handle API-specific errors
          if (error.response?.status) {
            throw new AIGenerationError(
              `API error: ${error.message}`,
              ErrorType.API_ERROR,
              error,
            );
          }

          // Handle tool execution errors
          if (error.name === "ToolExecutionError") {
            throw new AIGenerationError(
              `Tool execution failed: ${error.message}`,
              ErrorType.TOOL_EXECUTION,
              error,
            );
          }

          // Handle any other unexpected errors
          throw new AIGenerationError(
            `Unexpected error: ${error.message}`,
            ErrorType.API_ERROR,
            error,
          );
        }
      });
    }

    default:
      throw new AIGenerationError(
        `Provider ${provider} not supported`,
        ErrorType.VALIDATION,
      );
  }
}
