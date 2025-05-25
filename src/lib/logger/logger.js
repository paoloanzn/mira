import chalk from "chalk";

class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = this;
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  log(...args) {
    console.log(`[${this.getTimestamp()}] [LOG]`, ...args);
  }

  info(...args) {
    console.log(`[${this.getTimestamp()}] [INFO]`, chalk.blue("ℹ"), ...args);
  }

  warn(...args) {
    console.log(`[${this.getTimestamp()}] [WARN]`, chalk.yellow("⚠"), ...args);
  }

  error(...args) {
    console.log(`[${this.getTimestamp()}] [ERROR]`, chalk.red("✖"), ...args);
  }

  debug(...args) {
    if (process.env.DEBUG === "true") {
      console.log(
        `[${this.getTimestamp()}] [DEBUG]`,
        chalk.magenta("🔍"),
        ...args,
      );
    }
  }
}

export const logger = new Logger();
