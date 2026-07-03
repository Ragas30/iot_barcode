import { TokenController } from "@/src/controllers/token.controller";
import { createCorsPreflightResponse } from "@/src/lib/cors";
import { enforceRateLimit } from "@/src/lib/rate-limit";
import { successResponse } from "@/src/lib/response";
import { handleRouteError } from "@/src/utils/handle-route-error";
import { requireAuth } from "@/src/middleware/auth";

const controller = new TokenController();

export function OPTIONS(request: Request) {
  return createCorsPreflightResponse(request);
}

export async function GET(request: Request) {
  try {
    enforceRateLimit(request, "qr-list", 60, 60_000);
    const auth = await requireAuth();
    const data = await controller.list("qr", auth.sub);
    return successResponse("Daftar QR berhasil diambil.", data, 200, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/qr",
      method: "GET",
      request,
    });
  }
}

export async function POST(request: Request) {
  try {
    enforceRateLimit(request, "qr-create", 15, 60_000);
    const auth = await requireAuth();
    const body = await request.json();
    const data = await controller.create(auth.sub, body, "qr");
    return successResponse("QR berhasil dibuat.", data, 201, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/qr",
      method: "POST",
      request,
    });
  }
}
