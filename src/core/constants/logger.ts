import { ILevelsLogAllowed } from "../interfaces/logger";

enum ConsoleLoggerLevel {
  INFO = 'info',
  WARNING = 'warn',
  ERROR = 'error',
}

const logLevels: ILevelsLogAllowed = {
  info: process.env.LOG_INFO === 'true',
  warn: process.env.LOG_WARNING  === 'true',
  error: process.env.LOG_ERROR === 'true',
  debug: process.env.LOD_DEBUG  === 'true'
};

const logLevelsEnabled: ILevelsLogAllowed = {
  info: true,
  warn: true,
  error: true,
  debug: true
};

export {
  ConsoleLoggerLevel,
  logLevels,
  logLevelsEnabled
}
