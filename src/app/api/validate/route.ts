import { TokenController } from "@/src/controllers/token.controller";
import { createCorsPreflightResponse } from "@/src/lib/cors";
import { ValidationError } from "@/src/lib/errors";
import { enforceRateLimit } from "@/src/lib/rate-limit";
import { successResponse } from "@/src/lib/response";
import { handleRouteError } from "@/src/utils/handle-route-error";

const controller = new TokenController();

export function OPTIONS(request: Request) {
  return createCorsPreflightResponse(request);
}

export async function GET(request: Request) {
  try {
    enforceRateLimit(request, "validate-token", 120, 60_000);
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      throw new ValidationError("Token wajib diisi.");
    }

    const data = await controller.validate(token);
    return successResponse("Token valid.", data, 200, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/validate",
      method: "GET",
      request,
    });
  }
}
