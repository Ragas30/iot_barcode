import { AdminController } from "@/src/controllers/admin.controller";
import { createCorsPreflightResponse } from "@/src/lib/cors";
import { enforceRateLimit } from "@/src/lib/rate-limit";
import { successResponse } from "@/src/lib/response";
import { requireAuth } from "@/src/middleware/auth";
import { handleRouteError } from "@/src/utils/handle-route-error";

const controller = new AdminController();

export function OPTIONS(request: Request) {
  return createCorsPreflightResponse(request);
}

export async function GET(request: Request) {
  try {
    enforceRateLimit(request, "admin-list", 60, 60_000);
    await requireAuth();
    const data = await controller.list();
    return successResponse("Daftar user berhasil diambil.", data, 200, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/admin",
      method: "GET",
      request,
    });
  }
}

export async function POST(request: Request) {
  try {
    enforceRateLimit(request, "admin-create", 10, 60_000);
    await requireAuth();
    const body = await request.json();
    const data = await controller.create(body);
    return successResponse("User berhasil ditambahkan.", data, 201, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/admin",
      method: "POST",
      request,
    });
  }
}
