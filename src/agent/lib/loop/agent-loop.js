/**
 * @module agent-loop
 * Provides the core loop functionality for agent execution.
 */

import { AIGenerationError, ErrorType } from "../ai/errors.js";

/**
 * Enum for loop progress states
 * @readonly
 * @enum {string}
 */
export const LoopProgress = Object.freeze({
  NOT_STARTED: "not_started",
  RUNNING: "running",
  FINISHED: "finished",
});

/**
 * Enum for loop outcome states
 * @readonly
 * @enum {string}
 */
export const LoopOutcome = Object.freeze({
  NULL: null,
  SUCCESS: "success",
  FAILURE: "failure",
});

/**
 * Represents the state of an agent loop
 * @typedef {Object} LoopState
 * @property {string} progress - Current progress state (LoopProgress)
 * @property {string|null} outcome - Current outcome state (LoopOutcome)
 * @property {string|null} result - Result of the operation
 */

/**
 * Callback function type for loop completion
 * @callback LoopCallback
 * @param {LoopState} state - The current state of the loop
 */

/**
 * Represents a single execution unit of an agent
 */
export class AgentLoop {
  /**
   * Creates a new AgentLoop instance
   * @param {string} task - The task to be executed
   * @param {function} runtime - The execution runtime handler
   * @param {LoopCallback} onSuccess - Callback for successful completion
   * @param {LoopCallback} [onError=null] - Optional callback for error handling
   */
  constructor(task, runtime, onSuccess, onError = null) {
    if (typeof task !== "string" || !task.trim()) {
      throw new AIGenerationError(
        "Task must be a non-empty string",
        ErrorType.VALIDATION,
      );
    }

    if (typeof runtime !== "function") {
      throw new AIGenerationError(
        "Runtime must be a function",
        ErrorType.VALIDATION,
      );
    }

    if (typeof onSuccess !== "function") {
      throw new AIGenerationError(
        "onSuccess must be a function",
        ErrorType.VALIDATION,
      );
    }

    if (onError !== null && typeof onError !== "function") {
      throw new AIGenerationError(
        "onError must be a function or null",
        ErrorType.VALIDATION,
      );
    }

    this.task = task;
    this.runtime = runtime;
    this.onSuccess = onSuccess;
    this.onError = onError;

    /** @type {LoopState} */
    this.state = {
      progress: LoopProgress.NOT_STARTED,
      outcome: LoopOutcome.NULL,
      result: null,
    };
  }

  /**
   * Updates the loop state
   * @private
   * @param {Partial<LoopState>} newState - Partial state update
   */
  #updateState(newState) {
    this.state = { ...this.state, ...newState };
  }

  /**
   * Executes the loop
   * @async
   * @returns {Promise<void>}
   */
  async execute() {
    try {
      this.#updateState({
        progress: LoopProgress.RUNNING,
        outcome: LoopOutcome.NULL,
        result: null,
      });

      const result = await this.runtime(this.task);

      this.#updateState({
        progress: LoopProgress.FINISHED,
        outcome: LoopOutcome.SUCCESS,
        result,
      });

      await this.onSuccess(this.state);
    } catch (error) {
      this.#updateState({
        progress: LoopProgress.FINISHED,
        outcome: LoopOutcome.FAILURE,
        result: error instanceof Error ? error.message : String(error),
      });

      if (this.onError) {
        await this.onError(this.state);
      } else {
        throw new AIGenerationError(
          `Loop execution failed: ${error.message}`,
          ErrorType.API_ERROR,
          error,
        );
      }
    }
  }

  /**
   * Gets the current state of the loop
   * @returns {LoopState} The current state
   */
  getState() {
    return { ...this.state };
  }
}
