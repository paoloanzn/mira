import path from "node:path";
import fs from "fs";
import { fileURLToPath } from "url";
import { FlagEmbedding, EmbeddingModel } from "fastembed";
import { AIGenerationError, ErrorType } from "./errors.js";

/**
 * Client for generating embeddings using a local model.
 * Implements the Singleton pattern to ensure only one instance exists.
 * @class LocalEmbeddingClient
 */
class LocalEmbeddingClient {
  static instance = null;
  model = null;
  initPromise = null;
  initLock = null;
  expectedDimension = 384;

  /**
   * Creates a new LocalEmbeddingClient instance.
   * @private
   */
  constructor() {
    if (LocalEmbeddingClient.instance) {
      return LocalEmbeddingClient.instance;
    }
    LocalEmbeddingClient.instance = this;
  }

  /**
   * Gets the singleton instance of LocalEmbeddingClient.
   * @returns {LocalEmbeddingClient} The singleton instance
   */
  static getInstance() {
    if (!LocalEmbeddingClient.instance) {
      LocalEmbeddingClient.instance = new LocalEmbeddingClient();
    }
    return LocalEmbeddingClient.instance;
  }

  /**
   * Gets the root path of the application.
   * @private
   * @returns {Promise<string>} The absolute path to the root directory
   */
  async #getRootPath() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.resolve(__dirname, "../../../../");
  }

  /**
   * Initializes the embedding model.
   * @returns {Promise<void>}
   * @throws {AIGenerationError} If model initialization fails
   */
  async initialize() {
    if (this.model) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    // prevent multiple simultaneous inits
    if (this.initLock) {
      while (this.initLock) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return;
    }

    this.initLock = true;
    try {
      this.initPromise = this.#initModel();
      await this.initPromise;
    } catch (error) {
      throw new AIGenerationError(
        "Failed to initialize embedding model",
        ErrorType.API_ERROR,
        error,
      );
    } finally {
      this.initLock = false;
      this.initPromise = null;
    }
  }

  /**
   * Initializes the embedding model with specific configuration.
   * @private
   * @returns {Promise<void>}
   * @throws {AIGenerationError} If model initialization fails
   */
  async #initModel() {
    try {
      const rootPath = await this.#getRootPath();
      const cacheDir = path.join(rootPath, "models-cache");

      await fs.mkdir(cacheDir, { recursive: true });

      this.model = await FlagEmbedding.init({
        cacheDir,
        model: EmbeddingModel.BGESmallENV15,
        maxLength: 512,
      });
    } catch (error) {
      throw new AIGenerationError(
        "Failed to initialize embedding model",
        ErrorType.API_ERROR,
        error,
      );
    }
  }

  /**
   * Generates embeddings for the given input text.
   * @param {string} input - The text to generate embeddings for
   * @returns {Promise<number[]>} The generated embedding vector
   * @throws {AIGenerationError} If embedding generation fails
   */
  async generateEmbeddings(input) {
    if (!this.model) {
      await this.initialize();
    }

    if (!this.model) {
      throw new AIGenerationError(
        "Failed to initialize embedding model",
        ErrorType.API_ERROR,
      );
    }

    try {
      const embedding = this.model.queryEmbed(input);
      return this.#processEmbeddings(embedding);
    } catch (error) {
      throw new AIGenerationError(
        "Failed to generate embeddings",
        ErrorType.API_ERROR,
        error,
      );
    }
  }

  /**
   * Processes and validates the generated embeddings.
   * @private
   * @param {Float32Array|Float32Array[]} embedding - The raw embedding data
   * @returns {number[]} The processed embedding vector
   * @throws {AIGenerationError} If embedding processing fails
   */
  async #processEmbeddings(embedding) {
    let finalEmbedding;

    try {
      // FastEmbed returns an array of Float32Array when batching.
      // When a single string is passed, it returns a single Float32Array.
      if (
        ArrayBuffer.isView(embedding) &&
        embedding.constructor === Float32Array
      ) {
        finalEmbedding = Array.from(embedding);
      } else if (
        Array.isArray(embedding) &&
        ArrayBuffer.isView(embedding[0]) &&
        embedding[0].constructor === Float32Array
      ) {
        finalEmbedding = Array.from(embedding[0]); // Take the first embedding if batch
      } else if (Array.isArray(embedding)) {
        finalEmbedding = embedding;
      } else {
        throw new AIGenerationError(
          `Unexpected embedding format: ${typeof embedding}`,
          ErrorType.VALIDATION,
        );
      }

      finalEmbedding = finalEmbedding.map((n) => Number(n)); // Ensure numbers are plain JavaScript numbers

      if (
        !Array.isArray(finalEmbedding) ||
        finalEmbedding.length === 0 ||
        finalEmbedding[0] === undefined
      ) {
        throw new AIGenerationError(
          "Invalid embedding format: must be a non-empty array of numbers",
          ErrorType.VALIDATION,
        );
      }

      if (finalEmbedding.length !== this.expectedDimension) {
        throw new AIGenerationError(
          `Unexpected embedding dimension: ${finalEmbedding.length}. Expected: ${this.expectedDimension}`,
          ErrorType.VALIDATION,
        );
      }

      return finalEmbedding;
    } catch (error) {
      if (error instanceof AIGenerationError) {
        throw error;
      }
      throw new AIGenerationError(
        "Failed to process embeddings",
        ErrorType.VALIDATION,
        error,
      );
    }
  }
}

export const getEmbeddingManager = LocalEmbeddingClient.getInstance;
