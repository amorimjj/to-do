/**
 * Logger Strategy Interface
 * This allows us to swap the console implementation for a real 
 * tracing service (e.g., Sentry, Datadog) without changing our components.
 */
export interface Logger {
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, error?: Error | string | unknown, context?: Record<string, unknown>): void;
  debug(message: string, data?: unknown): void;
}

/**
 * Console Implementation (Default)
 */
class ConsoleLogger implements Logger {
  info(message: string, data?: unknown): void {
    console.info(`[INFO]: ${message}`, data ?? '');
  }

  warn(message: string, data?: unknown): void {
    console.warn(`[WARN]: ${message}`, data ?? '');
  }

  error(message: string, error?: Error | string | unknown, context?: Record<string, unknown>): void {
    let errorObject: Error;
    
    if (error instanceof Error) {
      errorObject = error;
    } else if (typeof error === 'string') {
      errorObject = new Error(error);
    } else {
      errorObject = new Error(String(error || 'Unknown error'));
    }

    console.error(`[ERROR]: ${message}`, {
      message: errorObject.message,
      stack: errorObject.stack,
      ...context,
    });
  }

  debug(message: string, data?: unknown): void {
    // Only log debug messages in development
    if (import.meta.env.DEV) {
      console.debug(`[DEBUG]: ${message}`, data ?? '');
    }
  }
}

// Singleton instance of the current strategy
export const logger: Logger = new ConsoleLogger();
