import { AuthController } from "@/src/controllers/auth.controller";
import { createCorsPreflightResponse } from "@/src/lib/cors";
import { enforceRateLimit, getClientIp } from "@/src/lib/rate-limit";
import { successResponse } from "@/src/lib/response";
import { handleRouteError } from "@/src/utils/handle-route-error";

const controller = new AuthController();

export function OPTIONS(request: Request) {
  return createCorsPreflightResponse(request);
}

export async function POST(request: Request) {
  try {
    enforceRateLimit(request, "auth-login", 5, 60_000);
    const body = await request.json();
    const admin = await controller.login(body, {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent"),
    });
    return successResponse("Login berhasil.", admin, 200, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/auth/login",
      method: "POST",
      request,
    });
  }
}
