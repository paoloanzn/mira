#!/usr/bin/env node
import { program } from "commander";
import { execSync } from "child_process";
import { Client } from "pg";
import fs from "fs/promises";
import dotenv from "dotenv";
import ora from "ora";
import chalk from "chalk";
import packageJson from "../package.json" with { type: "json" };
import { StatusChecker } from "./lib/status/status-checker.js";
import path from "path";

// Load environment variables
dotenv.config();

const DEFAULT_DB_CONFIG = {
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "twitter_agent",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
};

async function runMigrations() {
  const client = new Client(DEFAULT_DB_CONFIG);
  const spinner = ora("Running migrations...").start();

  try {
    await client.connect();

    // Create the vector extension first
    await client.query("CREATE EXTENSION IF NOT EXISTS vector;");

    // Get all migration files
    const migrationsDir = "./src/memory/drizzle/migrations";
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort();

    for (const file of sqlFiles) {
      spinner.text = `Applying migration: ${file}`;
      const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
      await client.query(sql);
    }

    spinner.succeed("✅ Migrations completed successfully");
  } catch (error) {
    spinner.fail(`❌ Migration failed: ${error.message}`);
    process.exit(1);
  } finally {
    await client.end();
  }
}

function execCommand(command) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`❌ Command failed: ${error.message}`);
    process.exit(1);
  }
}

async function checkAndRunMigrations() {
  const spinner = ora("Checking database migrations...").start();
  try {
    await runMigrations();
    spinner.succeed("✅ Database is up to date");
  } catch (error) {
    spinner.fail(`❌ Migration failed: ${error.message}`);
    // process.exit(1); temporary disabled until we ensure that migrations don't fail when db is already been created
  }
}

program
  .name(packageJson.name)
  .description("CLI to manage the Mira Agent system")
  .version(packageJson.version);

program
  .command("start")
  .description("Start the Mira Agent system")
  .option("-f, --foreground", "Run in foreground mode (non-detached)")
  .option("-d, --db", "Run only the database service")
  .option("--skip-migrations", "Skip running migrations on startup")
  .action(async (options) => {
    const detachFlag = options.foreground ? "" : "-d";
    const service = options.db ? "db" : "";
    execCommand(`docker-compose up --build ${detachFlag} ${service}`);
    if (!options.skipMigrations) {
      await checkAndRunMigrations();
    }
  });

program
  .command("stop")
  .description("Stop the Mira Agent system")
  .action(() => {
    execCommand("docker-compose down");
  });

program
  .command("migrate")
  .description("Run database migrations")
  .option("-g, --generate", "Generate new migrations without applying them")
  .action(async (options) => {
    if (options.generate) {
      execCommand("npx drizzle-kit generate");
      return;
    }
    await runMigrations();
  });

program
  .command("logs")
  .description("Show logs from all services")
  .option("-f, --follow", "Follow log output")
  .option("-s, --service <service>", "Show logs for specific service")
  .action((options) => {
    const followFlag = options.follow ? "-f" : "";
    const service = options.service || "";
    execCommand(`docker-compose logs ${followFlag} ${service}`);
  });

program
  .command("status")
  .description("Show status of all services")
  .option("-w, --watch", "Watch status changes continuously")
  .action(async (options) => {
    const statusChecker = new StatusChecker();
    const spinner = ora({
      text: "Checking services status...",
      color: "blue",
    }).start();

    try {
      const services = await statusChecker.getServicesStatus();
      spinner.stop();

      const { allRunning } = statusChecker.checkAllServicesRunning(services);

      if (!allRunning) {
        console.log(chalk.yellow("\nMira Agent is not running"));
        console.log(
          chalk.blue("\nTip: Run `mira-cli start` to start all services"),
        );
        return;
      }

      // Print formatted status
      const output = statusChecker.formatStatusOutput(services);
      console.log(output.join("\n"));

      if (options.watch) {
        console.log(
          chalk.dim("\nWatching for status changes (Ctrl+C to exit)..."),
        );
        setInterval(async () => {
          const updatedServices = await statusChecker.getServicesStatus();
          console.clear();
          console.log(
            statusChecker.formatStatusOutput(updatedServices).join("\n"),
          );
        }, 2000);
      }
    } catch (error) {
      spinner.fail(
        chalk.red(`Failed to check services status: ${error.message}`),
      );
      process.exit(1);
    }
  });

program
  .command("reset")
  .description("Reset the database (warning: this will delete all data)")
  .option("-s, --skip-migrations", "Reset without running migrations")
  .action(async (options) => {
    const spinner = ora("Resetting database...").start();
    try {
      // Stop all services
      spinner.text = "Stopping services...";
      execSync("docker-compose down", { stdio: "ignore" });

      // Remove the postgres volume
      spinner.text = "Removing database volume...";
      execSync("docker volume rm mira-cli_postgres_data", { stdio: "ignore" });

      // Start the database service
      spinner.text = "Starting database service...";
      execSync("docker-compose up -d db", { stdio: "ignore" });

      // Wait for database to be ready
      spinner.text = "Waiting for database to be ready...";
      await new Promise((resolve) => setTimeout(resolve, 5000));

      if (!options.skipMigrations) await checkAndRunMigrations();

      spinner.succeed(chalk.green("Database reset successfully."));
    } catch (error) {
      spinner.fail(chalk.red(`Failed to reset database: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command("db-monitor")
  .description("Monitor PostgreSQL database status")
  .action(async () => {
    const spinner = ora("Checking database status...").start();
    const client = new Client(DEFAULT_DB_CONFIG);

    try {
      await client.connect();
      spinner.text = "Fetching database information...";

      const { rows: dbSize } = await client.query(
        "SELECT pg_size_pretty(pg_database_size(current_database())) as size;",
      );
      console.log(`\nDatabase size: ${dbSize[0].size}`);

      const { rows: connections } = await client.query(
        "SELECT count(*) FROM pg_stat_activity WHERE datname = current_database();",
      );
      console.log(`Active connections: ${connections[0].count}`);

      spinner.succeed("✅ Database status checked successfully.");
    } catch (error) {
      spinner.fail(`❌ Failed to monitor database: ${error.message}`);
      process.exit(1);
    } finally {
      await client.end();
    }
  });

program
  .command("launch")
  .description("Start the Mira Agent system and launch the UI")
  .option("--skip-migrations", "Skip running migrations on startup")
  .action(async (options) => {
    const statusChecker = new StatusChecker();
    const spinner = ora("Checking services status...").start();

    try {
      const services = await statusChecker.getServicesStatus();
      const { allRunning } = statusChecker.checkAllServicesRunning(services);

      if (!allRunning) {
        spinner.text = "Starting Mira Agent services...";
        // Start services in detached mode
        execCommand("docker-compose up --build -d");

        if (!options.skipMigrations) {
          await checkAndRunMigrations();
        }
      }

      spinner.succeed("✅ Services are running");

      // Launch the UI
      spinner.start("Launching Mira UI...");
      execCommand("npx mira-ui");
      spinner.stop();
    } catch (error) {
      spinner.fail(chalk.red(`Failed to launch: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
