import { SafeController } from "@/src/controllers/safe.controller";
import { createCorsPreflightResponse } from "@/src/lib/cors";
import { enforceRateLimit } from "@/src/lib/rate-limit";
import { successResponse } from "@/src/lib/response";
import { requireAuth } from "@/src/middleware/auth";
import { handleRouteError } from "@/src/utils/handle-route-error";

const controller = new SafeController();

export function OPTIONS(request: Request) {
  return createCorsPreflightResponse(request);
}

export async function GET(request: Request) {
  try {
    enforceRateLimit(request, "safe-logs", 60, 60_000);
    await requireAuth();
    const data = await controller.listLogs();
    return successResponse("Riwayat buka brankas berhasil diambil.", data, 200, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/safe/logs",
      method: "GET",
      request,
    });
  }
}
