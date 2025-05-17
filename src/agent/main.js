import { setup } from "./setup.js";
import { performLogin } from "./lib/scraper/performLogin.js";
import { getScraper } from "./lib/scraper/getScraper.js";
import { startServer } from "./api/server.js";
import { getMemoryClient } from "./lib/memory/memory-client.js";

export async function startAgent() {
  try {
    await setup();

    const scraper = getScraper();
    const { success, message } = await performLogin(scraper);
    if (!success) {
      throw new Error(`Login failed: ${message}`);
    }

    const memoryClient = getMemoryClient();
    const { userId: agentUserId, error: userError } =
      await memoryClient.getOrCreateUser("agent", {
        is_agent: true,
      });

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
