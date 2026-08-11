import { AuthController } from "@/src/controllers/auth.controller";
import { createCorsPreflightResponse } from "@/src/lib/cors";
import { enforceRateLimit } from "@/src/lib/rate-limit";
import { successResponse } from "@/src/lib/response";
import { requireAuth } from "@/src/middleware/auth";
import { handleRouteError } from "@/src/utils/handle-route-error";

const controller = new AuthController();

export function OPTIONS(request: Request) {
  return createCorsPreflightResponse(request);
}

export async function GET(request: Request) {
  try {
    enforceRateLimit(request, "auth-logs", 60, 60_000);
    await requireAuth();
    const data = await controller.listLogs();
    return successResponse("Log login berhasil diambil.", data, 200, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/auth/logs",
      method: "GET",
      request,
    });
  }
}
