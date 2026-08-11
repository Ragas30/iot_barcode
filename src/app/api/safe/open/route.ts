import { SafeController } from "@/src/controllers/safe.controller";
import { createCorsPreflightResponse } from "@/src/lib/cors";
import { enforceRateLimit } from "@/src/lib/rate-limit";
import { successResponse } from "@/src/lib/response";
import { handleRouteError } from "@/src/utils/handle-route-error";

const controller = new SafeController();

export function OPTIONS(request: Request) {
  return createCorsPreflightResponse(request);
}

export async function POST(request: Request) {
  try {
    enforceRateLimit(request, "safe-open", 30, 60_000);
    const body = await request.json();
    const data = await controller.open(body);
    return successResponse("Brankas berhasil dibuka.", data, 200, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/safe/open",
      method: "POST",
      request,
    });
  }
}
