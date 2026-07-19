import { AuthController } from "@/src/controllers/auth.controller";
import { createCorsPreflightResponse } from "@/src/lib/cors";
import { enforceRateLimit } from "@/src/lib/rate-limit";
import { successResponse } from "@/src/lib/response";
import { handleRouteError } from "@/src/utils/handle-route-error";

const controller = new AuthController();

export function OPTIONS(request: Request) {
  return createCorsPreflightResponse(request);
}

export async function GET(request: Request) {
  try {
    enforceRateLimit(request, "verify-pin", 120, 60_000);
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get("pin");
    
    const data = await controller.verifyPin({ pin });
    return successResponse("PIN valid.", data, 200, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/verify_pin",
      method: "GET",
      request,
    });
  }
}
