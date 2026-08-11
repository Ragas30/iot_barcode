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
    enforceRateLimit(request, "auth-logout", 20, 60_000);

    let adminId: string | undefined;
    try {
      const auth = await requireAuth();
      adminId = auth.sub;
    } catch {
      // Token mungkin sudah expired; cookie tetap dibersihkan.
    }

    await controller.logout(adminId);
    return successResponse("Logout berhasil.", {}, 200, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/auth/logout",
      method: "POST",
      request,
    });
  }
}
