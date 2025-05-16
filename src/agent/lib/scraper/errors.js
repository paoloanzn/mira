/**
 * @module scraper/errors
 * Provides error handling for scraper operations.
 */

import { ErrorType } from '../ai/errors.js';

/**
 * Custom error class for scraper operations
 */
export class ScraperError extends Error {
  constructor(message, type, originalError = null) {
    super(message);
    this.name = 'ScraperError';
    this.type = type;
    this.originalError = originalError;
  }
}

/**
 * Error types specific to scraper operations
 * @readonly
 * @enum {string}
 */
export const ScraperErrorType = Object.freeze({
  ...ErrorType,
  AUTHENTICATION: 'authentication',
  COOKIE_VALIDATION: 'cookie_validation',
  CREDENTIALS: 'credentials',
  SESSION: 'session',
});

/**
 * Specific error for authentication failures
 */
export class ScraperAuthenticationError extends ScraperError {
  constructor(message, originalError = null) {
    super(message, ScraperErrorType.AUTHENTICATION, originalError);
    this.name = 'ScraperAuthenticationError';
  }
}

/**
 * Error for invalid or missing credentials
 */
export class ScraperCredentialsError extends ScraperError {
  constructor(message, originalError = null) {
    super(message, ScraperErrorType.CREDENTIALS, originalError);
    this.name = 'ScraperCredentialsError';
  }
}

/**
 * Error for cookie-related issues
 */
export class ScraperCookieError extends ScraperError {
  constructor(message, originalError = null) {
    super(message, ScraperErrorType.COOKIE_VALIDATION, originalError);
    this.name = 'ScraperCookieError';
  }
}

/**
 * Error for session-related issues
 */
export class ScraperSessionError extends ScraperError {
  constructor(message, originalError = null) {
    super(message, ScraperErrorType.SESSION, originalError);
    this.name = 'ScraperSessionError';
  }
} 