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

export async function POST(request: Request) {
  try {
    enforceRateLimit(request, "auth-pin-setup", 10, 60_000);
    const auth = await requireAuth();
    const body = await request.json();
    const data = await controller.setupPin(auth.sub, body);
    return successResponse("PIN berhasil disimpan.", data, 200, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/auth/pin",
      method: "POST",
      request,
    });
  }
}
