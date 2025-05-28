/**
 * Base error class for all API errors
 * @class CustomBaseError
 * @extends Error
 */
export class CustomBaseError extends Error {
  /**
   * Creates a new CustomBaseError instance
   * @param {string} message - Error message
   * @param {string} type - Error type from ErrorType enum
   * @param {Error} [originalError] - Original error if any
   */
  constructor(message, type, originalError = null) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.originalError = originalError;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error types enum
 * @enum {string}
 */
export const ErrorType = Object.freeze({
  VALIDATION: 'validation',
  NETWORK: 'network',
  BUSINESS_LOGIC: 'business_logic',
  EXTERNAL_SERVICE: 'external_service',
  UNKNOWN: 'unknown',
});

/**
 * Validation error class
 * @class ValidationError
 * @extends CustomBaseError
 */
export class ValidationError extends CustomBaseError {
  constructor(message, originalError = null) {
    super(message, ErrorType.VALIDATION, originalError);
  }
}

/**
 * Network error class
 * @class NetworkError
 * @extends CustomBaseError
 */
export class NetworkError extends CustomBaseError {
  constructor(message, originalError = null) {
    super(message, ErrorType.NETWORK, originalError);
  }
}

/**
 * Business logic error class
 * @class BusinessLogicError
 * @extends CustomBaseError
 */
export class BusinessLogicError extends CustomBaseError {
  constructor(message, originalError = null) {
    super(message, ErrorType.BUSINESS_LOGIC, originalError);
  }
}

/**
 * External service error class
 * @class ExternalServiceError
 * @extends CustomBaseError
 */
export class ExternalServiceError extends CustomBaseError {
  constructor(message, originalError = null) {
    super(message, ErrorType.EXTERNAL_SERVICE, originalError);
  }
} 