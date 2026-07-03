type LogContext = {
  requestId?: string;
  endpoint?: string;
  method?: string;
  user?: string;
  code?: string;
  status?: number;
  stack?: string;
};

export function logError(message: string, context: LogContext) {
  console.error(
    JSON.stringify({
      level: "error",
      timestamp: new Date().toISOString(),
      message,
      ...context,
    }),
  );
}
