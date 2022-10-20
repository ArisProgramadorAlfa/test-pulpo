import { ConsoleLoggerLevel, logLevelsEnabled } from "../constants/logger";
import { ILevelsLogAllowed, InputLogger, InputPrintLogger } from "../interfaces/logger";

const {
  INFO,
  ERROR,
  WARNING
} = ConsoleLoggerLevel;

/**
 * Logger class, to help parsing data into verbose logs.
 *
 * @param owner string of the owner of the project | example: 'user'
 * @param source string of the code | example: 'user-bnd.ts' to easy identify where in the code is the log.
 * @param levelsEnabled object of type ILevelsAllowed with levels enables for print in console.
 *
 * it has some kind of logs:
 * console, it takes data and prints it with owner, source
 * message, data and prints it with owner and source
 *
 * we have 4 levels of log:
 * info,
 * warning,
 * error and
 * debug
 */
export class Logger {
  private readonly owner: string;
  private readonly source: string;
  private readonly levelsEnabled: ILevelsLogAllowed;

  constructor(
    owner = 'NO_OWNER',
    source = 'NO_SOURCE',
    levelsEnabled: ILevelsLogAllowed = logLevelsEnabled
  ) {
    this.source = source;
    this.owner = owner;
    this.levelsEnabled = levelsEnabled;
  }

  info<T extends InputLogger>(input: T) {
    if (this.levelsEnabled.info) {
      this.printLog({ ...input }, INFO);
    }
  }
  warning<T extends InputLogger>(input: T) {
    if (this.levelsEnabled.warn) {
      this.printLog({ ...input }, WARNING);
    }
  }
  error<T extends InputLogger>(input: T) {
    if (this.levelsEnabled.error) {
      this.printLog({ ...input }, ERROR);
    }
  }
  debug<T extends InputLogger>(input: T) {
    if (this.levelsEnabled.debug) {
      this.printLog({ ...input }, INFO);
    }
  }

  private printLog(
    input: InputPrintLogger,
    level: ConsoleLoggerLevel = INFO
  ) {
    const logObject = {
      ...input,
      owner: this.owner,
      source: this.source,
      data: { ...(input.data || {}) },
    };

    if (level === ERROR && logObject.error) {
      console[level](
        JSON.stringify(logObject, null, 4),
        logObject.error
      );
    } else {
      console[level](JSON.stringify(logObject, null, 4));
    }
  }
}
