import { NextRequest, NextResponse } from "next/server";
import { TokenController } from "@/src/controllers/token.controller";
import { requireAuth } from "@/src/middleware/auth";
import { handleRouteError } from "@/src/utils/handle-route-error";
import type { TokenType } from "@/src/types/entities";

const controller = new TokenController();

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth();
    const body = await request.json();
    const { type } = body as { type: TokenType };

    if (!type || (type !== "qr" && type !== "barcode")) {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 400 }
      );
    }

    const result = await controller.clearByType(type, auth.sub);

    return NextResponse.json(
      {
        success: true,
        message: `${result.deletedCount} ${type} tokens cleared successfully`,
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
