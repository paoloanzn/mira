import { withRetries } from "../ai/errors.js";
import {
  ScraperAuthenticationError,
  ScraperCredentialsError,
  ScraperCookieError,
} from "./errors.js";
import { updateEnvVariable } from "../utils/envManager.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * @typedef {Object} LoginResult
 * @property {boolean} success - Whether the login was successful
 * @property {string|null} message - Optional message describing the result
 */

/**
 * Validates and parses cookie string into an array of formatted cookies
 * @private
 * @param {string} cookieStr - Raw cookie string from environment
 * @returns {string[]} Array of formatted cookie strings
 * @throws {ScraperCookieError} If cookie parsing fails
 */
function parseCookies(cookieStr) {
  try {
    const cookies = JSON.parse(cookieStr);

    // if (!Array.isArray(cookies)) {
    //   throw new Error('Cookies must be an array');
    // }

    return cookies.map(
      (cookie) => `${cookie.key}=${cookie.value}; domain=.twitter.com; path=/`,
    );
  } catch (error) {
    throw new ScraperCookieError(
      "Failed to parse cookies from environment",
      error,
    );
  }
}

/**
 * Retrieves credentials from environment variables
 * @private
 * @returns {Object} Object containing credentials
 * @throws {ScraperCredentialsError} If required credentials are missing
 */
function getCredentials() {
  const username = process.env.TWITTER_USERNAME;
  const password = process.env.TWITTER_PASSWORD;
  const email = process.env.TWITTER_EMAIL;
  const cookies = process.env.TWITTER_COOKIES;

  if (!username || !password) {
    throw new ScraperCredentialsError(
      "Required credentials missing from environment variables",
    );
  }

  return {
    username,
    password,
    email,
    cookies,
  };
}

/**
 * Saves cookies to the environment file
 * @private
 * @param {Array<Object>} cookies - Array of cookie objects to save
 * @throws {ScraperCookieError} If saving cookies fails
 */
async function saveCookies(cookies) {
  try {
    await updateEnvVariable("TWITTER_COOKIES", cookies);
  } catch (error) {
    throw new ScraperCookieError(
      "Failed to save cookies to environment file",
      error,
    );
  }
}

/**
 * Performs login for the scraper instance using credentials from environment variables
 * and handles both cookie and password-based authentication.
 *
 * @param {Scraper} scraper - The scraper instance to authenticate
 * @returns {Promise<LoginResult>} The login result
 */
export async function performLogin(scraper) {
  try {
    // Check if already logged in
    const isLoggedIn = await withRetries(async () => scraper.isLoggedIn());
    if (isLoggedIn) {
      return { success: true, message: "Already logged in" };
    }

    const credentials = getCredentials();

    // Try cookie-based authentication first if cookies are available
    if (credentials.cookies) {
      try {
        const parsedCookies = parseCookies(credentials.cookies);
        await scraper.setCookies(parsedCookies);

        const cookieLoginSuccess = await withRetries(async () =>
          scraper.isLoggedIn(),
        );
        if (cookieLoginSuccess) {
          return {
            success: true,
            message: "Successfully logged in with cookies",
          };
        }
      } catch (error) {
        // If cookie login fails, fall back to password login
        console.warn(
          "Cookie login failed, falling back to password login:",
          error.message,
        );
      }
    }

    // Password-based authentication
    try {
      await withRetries(async () =>
        scraper.login(
          credentials.username,
          credentials.password,
          credentials.email,
        ),
      );

      const loginSuccess = await withRetries(async () => scraper.isLoggedIn());
      if (!loginSuccess) {
        throw new ScraperAuthenticationError("Login verification failed");
      }

      // Get and save new cookies for future sessions
      const newCookies = await scraper.getCookies();
      await saveCookies(newCookies);

      return {
        success: true,
        message: "Successfully logged in with password",
      };
    } catch (error) {
      throw new ScraperAuthenticationError(
        "Failed to login with password",
        error,
      );
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
