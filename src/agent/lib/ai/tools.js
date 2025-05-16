import { z } from "zod";
import { tool } from "ai";
import { getScraper } from "../scraper/getScraper.js";
import { SearchMode } from "agent-twitter-client";

// Constants for rate limiting
export const MAX_TWEETS_LIMIT = 100;
export const MAX_FOLLOWERS_LIMIT = 100;
export const MAX_FOLLOWING_LIMIT = 100;
export const MAX_SEARCH_RESULTS_LIMIT = 50;

/**
 * Helper function to collect async iterator results into an array
 * @param {AsyncIterator} iterator - The async iterator to collect from
 * @param {number} limit - Maximum number of items to collect
 * @returns {Promise<Array>} Array of collected items
 */
async function collectIteratorResults(iterator, limit) {
  const results = [];
  for await (const item of iterator) {
    if (item) {
      results.push(item);
      if (results.length >= limit) break;
    }
  }
  return results;
}

export const getUserTweets = tool({
  description:
    "Get tweets from a specific Twitter user, limited to the most recent tweets.",
  parameters: z.object({
    username: z
      .string()
      .min(1)
      .describe("Twitter username to fetch tweets from"),
    maxTweets: z
      .number()
      .optional()
      .default(20)
      .describe("Maximum number of tweets to fetch (max 100)"),
  }),
  execute: async ({ username, maxTweets }) => {
    const scraper = getScraper();
    const limit = Math.min(maxTweets, MAX_TWEETS_LIMIT);
    const tweetsIterator = scraper.getTweets(username, limit);
    return await collectIteratorResults(tweetsIterator, limit);
  },
});

export const getUserTweetsAndReplies = tool({
  description:
    "Get tweets and replies from a specific Twitter user, limited to the most recent items.",
  parameters: z.object({
    username: z
      .string()
      .min(1)
      .describe("Twitter username to fetch tweets and replies from"),
    maxTweets: z
      .number()
      .optional()
      .default(20)
      .describe("Maximum number of tweets to fetch (max 100)"),
  }),
  execute: async ({ username, maxTweets }) => {
    const scraper = getScraper();
    const limit = Math.min(maxTweets, MAX_TWEETS_LIMIT);
    const tweetsIterator = scraper.getTweetsAndReplies(username, limit);
    return await collectIteratorResults(tweetsIterator, limit);
  },
});

export const getLatestTweet = tool({
  description: "Get the latest tweet from a specific Twitter user.",
  parameters: z.object({
    username: z
      .string()
      .min(1)
      .describe("Twitter username to fetch the latest tweet from"),
  }),
  execute: async ({ username }) => {
    const scraper = getScraper();
    return await scraper.getLatestTweet(username);
  },
});

export const getUserRetweets = tool({
  description:
    "Get retweets from a specific Twitter user, limited to the most recent retweets.",
  parameters: z.object({
    username: z
      .string()
      .min(1)
      .describe("Twitter username to fetch retweets from"),
    maxTweets: z
      .number()
      .optional()
      .default(20)
      .describe("Maximum number of tweets to check for retweets (max 100)"),
  }),
  execute: async ({ username, maxTweets }) => {
    const scraper = getScraper();
    const limit = Math.min(maxTweets, MAX_TWEETS_LIMIT);
    const tweetsIterator = scraper.getTweets(username, limit);
    const tweets = await collectIteratorResults(tweetsIterator, limit);
    return tweets.filter((tweet) => tweet.isRetweet);
  },
});

export const getUserFollowers = tool({
  description: "Get followers of a specific Twitter user.",
  parameters: z.object({
    userId: z
      .string()
      .min(1)
      .describe("Twitter user ID to fetch followers from"),
    maxFollowers: z
      .number()
      .optional()
      .default(20)
      .describe("Maximum number of followers to fetch (max 100)"),
  }),
  execute: async ({ userId, maxFollowers }) => {
    const scraper = getScraper();
    const limit = Math.min(maxFollowers, MAX_FOLLOWERS_LIMIT);
    const followersIterator = scraper.getFollowers(userId, limit);
    return await collectIteratorResults(followersIterator, limit);
  },
});

export const getUserFollowing = tool({
  description: "Get users that a specific Twitter user is following.",
  parameters: z.object({
    userId: z
      .string()
      .min(1)
      .describe("Twitter user ID to fetch following from"),
    maxFollowing: z
      .number()
      .optional()
      .default(20)
      .describe("Maximum number of following to fetch (max 100)"),
  }),
  execute: async ({ userId, maxFollowing }) => {
    const scraper = getScraper();
    const limit = Math.min(maxFollowing, MAX_FOLLOWING_LIMIT);
    const followingIterator = scraper.getFollowing(userId, limit);
    return await collectIteratorResults(followingIterator, limit);
  },
});

export const followUser = tool({
  description: "Follow a specific Twitter user.",
  parameters: z.object({
    username: z.string().min(1).describe("Twitter username to follow"),
  }),
  execute: async ({ username }) => {
    const scraper = getScraper();
    return await scraper.followUser(username);
  },
});

export const searchTweets = tool({
  description: "Search for tweets using a specific query.",
  parameters: z.object({
    query: z.string().min(1).describe("Search query for tweets"),
    maxResults: z
      .number()
      .optional()
      .default(20)
      .describe("Maximum number of results to fetch (max 50)"),
    mode: z
      .enum(["Latest", "Top"])
      .optional()
      .default("Latest")
      .describe("Search mode: Latest or Top"),
  }),
  execute: async ({ query, maxResults, mode }) => {
    const scraper = getScraper();
    const limit = Math.min(maxResults, MAX_SEARCH_RESULTS_LIMIT);
    const searchMode = mode === "Latest" ? SearchMode.Latest : SearchMode.Top;
    const tweetsIterator = scraper.searchTweets(query, limit, searchMode);
    return await collectIteratorResults(tweetsIterator, limit);
  },
});

export const searchProfiles = tool({
  description: "Search for Twitter profiles using a specific query.",
  parameters: z.object({
    query: z.string().min(1).describe("Search query for profiles"),
    maxResults: z
      .number()
      .optional()
      .default(10)
      .describe("Maximum number of results to fetch (max 50)"),
  }),
  execute: async ({ query, maxResults }) => {
    const scraper = getScraper();
    const limit = Math.min(maxResults, MAX_SEARCH_RESULTS_LIMIT);
    const profilesIterator = scraper.searchProfiles(query, limit);
    return await collectIteratorResults(profilesIterator, limit);
  },
});

export const fetchProfileSearch = tool({
  description: "Fetch a page of profile search results.",
  parameters: z.object({
    query: z.string().min(1).describe("Search query for profiles"),
    maxResults: z
      .number()
      .optional()
      .default(10)
      .describe("Maximum number of results to fetch (max 50)"),
  }),
  execute: async ({ query, maxResults }) => {
    const scraper = getScraper();
    const limit = Math.min(maxResults, MAX_SEARCH_RESULTS_LIMIT);
    return await scraper.fetchSearchProfiles(query, limit);
  },
});

export const getProfile = tool({
  description: "Get a Twitter user's profile information.",
  parameters: z.object({
    username: z
      .string()
      .min(1)
      .describe("Twitter username to fetch profile for"),
  }),
  execute: async ({ username }) => {
    const scraper = getScraper();
    return await scraper.getProfile(username);
  },
});

export const tools = {
  getUserTweets,
  getUserTweetsAndReplies,
  getLatestTweet,
  getUserRetweets,
  getUserFollowers,
  getUserFollowing,
  followUser,
  searchTweets,
  searchProfiles,
  fetchProfileSearch,
  getProfile,
};
