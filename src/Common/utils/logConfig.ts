type LogLevel = "debug" | "info" | "log" | "warn" | "error";

interface LogSettings {
  enabledLevels: LogLevel[];
}

// Configure which log levels are enabled
const settings: LogSettings = {
  enabledLevels: ["debug", "info", "log", "warn", "error"], // Enable all in development
  // enabledLevels: ['error'], // Production: only errors
};

// Store original console methods
const originalConsole = {
  debug: console.debug,
  info: console.info,
  log: console.log,
  warn: console.warn,
  error: console.error,
};

// Override console methods based on configuration
export const configureLogging = () => {
  console.debug = settings.enabledLevels.includes("debug") ? originalConsole.debug : () => {};

  console.info = settings.enabledLevels.includes("info") ? originalConsole.info : () => {};

  console.log = settings.enabledLevels.includes("log") ? originalConsole.log : () => {};

  console.warn = settings.enabledLevels.includes("warn") ? originalConsole.warn : () => {};

  console.error = settings.enabledLevels.includes("error") ? originalConsole.error : () => {};
};

// Call this at app startup
configureLogging();
