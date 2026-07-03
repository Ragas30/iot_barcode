import { ZodError } from "zod";
import { AppError, InternalServerError } from "@/src/lib/errors";
import { logError } from "@/src/lib/logger";
import { errorResponse } from "@/src/lib/response";

export function handleRouteError(
  error: unknown,
  context: {
    endpoint: string;
    method: string;
    request?: Request;
    requestId?: string;
    user?: string;
  },
) {
  if (error instanceof ZodError) {
    return errorResponse(
      error.issues[0]?.message ?? "Validasi gagal.",
      "VALIDATION_ERROR",
      422,
      context.request,
    );
  }

  const appError = error instanceof AppError ? error : new InternalServerError();

  logError(appError.message, {
    ...context,
    code: appError.code,
    status: appError.statusCode,
    stack: process.env.NODE_ENV === "development" ? appError.stack : undefined,
  });

  return errorResponse(
    appError.message,
    appError.code,
    appError.statusCode,
    context.request,
  );
}
