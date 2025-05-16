/**
 * @module errors
 * Provides error handling utilities for AI text generation.
 */

/**
 * Custom error class for AI generation errors
 */
export class AIGenerationError extends Error {
  constructor(message, type, originalError = null) {
    super(message);
    this.name = "AIGenerationError";
    this.type = type;
    this.originalError = originalError;
  }
}

/**
 * Error types for AI generation
 * @readonly
 * @enum {string}
 */
export const ErrorType = Object.freeze({
  TOOL_EXECUTION: "tool_execution",
  STREAM_GENERATION: "stream_generation",
  API_ERROR: "api_error",
  VALIDATION: "validation",
});

/**
 * Configuration for retry mechanism
 * @typedef {Object} RetryConfig
 * @property {number} maxRetries - Maximum number of retry attempts
 * @property {number} baseDelay - Base delay in milliseconds between retries
 * @property {number} maxDelay - Maximum delay in milliseconds between retries
 */

/**
 * Default retry configuration
 * @type {RetryConfig}
 */
export const defaultRetryConfig = Object.freeze({
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
});

/**
 * Calculates exponential backoff delay
 * @private
 * @param {number} attempt - Current attempt number
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} maxDelay - Maximum delay in milliseconds
 * @returns {number} Delay in milliseconds
 */
function calculateBackoff(attempt, baseDelay, maxDelay) {
  const delay = Math.min(
    maxDelay,
    baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
  );
  return delay;
}

/**
 * Determines if an error is retryable
 * @private
 * @param {Error} error - The error to check
 * @returns {boolean} Whether the error is retryable
 */
function isRetryableError(error) {
  // Network errors, rate limits, and temporary service issues are retryable
  if (error instanceof AIGenerationError) {
    return (
      error.type === ErrorType.API_ERROR ||
      error.type === ErrorType.STREAM_GENERATION
    );
  }

  // Check for common network error patterns
  return (
    error.message.includes("ECONNRESET") ||
    error.message.includes("ETIMEDOUT") ||
    error.message.includes("rate limit") ||
    error.message.toLowerCase().includes("timeout") ||
    error.message.includes("503") ||
    error.message.includes("429")
  );
}

/**
 * Executes a function with retry logic
 * @async
 * @template T
 * @param {function(): Promise<T>} fn - The async function to execute
 * @param {RetryConfig} [config=defaultRetryConfig] - Retry configuration
 * @returns {Promise<T>} The result of the function execution
 * @throws {Error} If all retry attempts fail
 */
export async function withRetries(fn, config = defaultRetryConfig) {
  let lastError = null;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === config.maxRetries) {
        throw error;
      }

      const delay = calculateBackoff(
        attempt,
        config.baseDelay,
        config.maxDelay,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
