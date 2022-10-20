type InputLogger = IInputOfLogger | IInputOfLoggerError;
type InputPrintLogger = Partial<
  IInputOfLogger & IInputOfLoggerError
>;

interface IBaseLogger {
  logKey: string;
  message?: string;
}

interface IInputOfLogger extends IBaseLogger {
  data?: any;
}

interface IInputOfLoggerError extends IBaseLogger {
  error: any;
}

interface ILevelsLogAllowed {
  info: boolean;
  error: boolean;
  warn: boolean;
  debug: boolean;
}

export {
  InputLogger,
  InputPrintLogger,
  ILevelsLogAllowed
}