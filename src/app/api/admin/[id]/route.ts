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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    enforceRateLimit(request, "admin-update", 20, 60_000);
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = await controller.update(id, body);
    return successResponse("User berhasil diperbarui.", data, 200, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/admin/[id]",
      method: "PATCH",
      request,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    enforceRateLimit(request, "admin-delete", 10, 60_000);
    const auth = await requireAuth();
    const { id } = await params;
    const data = await controller.remove(id, auth.sub);
    return successResponse("User berhasil dihapus.", data, 200, request);
  } catch (error) {
    return handleRouteError(error, {
      endpoint: "/api/admin/[id]",
      method: "DELETE",
      request,
    });
  }
}
