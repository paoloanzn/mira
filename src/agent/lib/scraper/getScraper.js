import { Scraper } from "agent-twitter-client";

/** @type {Scraper|null} Singleton instance of the Scraper class */
let scraper = null;

/**
 * Returns a singleton instance of the Scraper class.
 *
 * If an instance doesn't exist, creates a new one. Otherwise returns the existing instance.
 * @returns {Scraper} The Scraper instance
 */
export function getScraper() {
  if (!scraper) {
    scraper = new Scraper();
  }
  return scraper;
}
