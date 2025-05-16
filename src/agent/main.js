import { setup } from "./setup.js";
import { performLogin } from "./lib/scraper/performLogin.js";
import { getScraper } from "./lib/scraper/getScraper.js";
import { getUserManager } from "./lib/memory/user-manager.js";
import { startServer } from "./api/server.js";

export async function startAgent() {
  try {
    // 1. Perform setup (environment variables, etc.)
    await setup();

    // 2. Initialize scraper and perform login
    const scraper = getScraper();
    const { success, message } = await performLogin(scraper);
    if (!success) {
      throw new Error(`Login failed: ${message}`);
    }

    // 3. Register agent in memory service if not already registered
    const userManager = getUserManager();
    const { userId: agentUserId, error: userError } = await userManager.getOrCreateAgentUser();
    if (userError) {
      throw new Error(`Failed to get/create agent user: ${userError.message}`);
    }

    // 4. Start the API server
    await startServer(agentUserId);

    console.log("Agent started successfully");
  } catch (error) {
    console.error("Failed to start agent:", error);
    process.exit(1);
  }
}


startAgent();