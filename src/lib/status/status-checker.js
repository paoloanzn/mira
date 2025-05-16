import { execSync } from "child_process";
import chalk from "chalk";

/**
 * @typedef {Object} ServiceStatus
 * @property {string} name - Service name
 * @property {boolean} isRunning - Whether the service is running
 * @property {string} state - Current state of the service
 * @property {string} [error] - Error message if any
 */

/**
 * Class responsible for checking Docker container statuses
 */
export class StatusChecker {
  /**
   * Get status of all services
   * @returns {Promise<ServiceStatus[]>}
   */
  async getServicesStatus() {
    try {
      const output = execSync("docker-compose ps --format json", {
        encoding: "utf-8",
      });
      const services = JSON.parse(`[${output.trim().split("\n").join(",")}]`);

      return services.map((service) => ({
        name: service.Service,
        isRunning: service.State === "running",
        state: service.State,
        ports: service.Ports,
      }));
    } catch (error) {
      throw new Error(`Failed to get services status: ${error.message}`);
    }
  }

  /**
   * Format status output with colors and symbols
   * @param {ServiceStatus[]} services
   * @returns {string[]} Formatted status lines
   */
  formatStatusOutput(services) {
    const lines = [];
    const maxNameLength = Math.max(...services.map((s) => s.name.length));

    lines.push(chalk.bold("\nMira Agent Services Status:"));
    lines.push(chalk.dim("─".repeat(50)));

    for (const service of services) {
      const paddedName = service.name.padEnd(maxNameLength);
      const status = service.isRunning
        ? chalk.green("● running")
        : chalk.red("○ stopped");

      const ports = service.ports ? chalk.dim(` (${service.ports})`) : "";
      lines.push(`${chalk.blue(paddedName)} ${status}${ports}`);
    }

    lines.push(chalk.dim("─".repeat(50)));
    return lines;
  }

  /**
   * Check if all required services are running
   * @param {ServiceStatus[]} services
   * @returns {{ allRunning: boolean, notRunning: string[] }}
   */
  checkAllServicesRunning(services) {
    const notRunning = services
      .filter((service) => !service.isRunning)
      .map((service) => service.name);

    return {
      allRunning: notRunning.length === 0 && services.length != 0,
      notRunning,
    };
  }
}
