import { NextResponse } from "next/server";
import { applyCors } from "@/src/lib/cors";

export function successResponse<T>(
  message: string,
  data: T,
  status = 200,
  request?: Request,
) {
  const response = NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );

  return applyCors(response, request);
}

export function errorResponse(
  message: string,
  code: string,
  status = 500,
  request?: Request,
) {
  const response = NextResponse.json(
    {
      success: false,
      message,
      error: { code },
    },
    { status },
  );

  return applyCors(response, request);
}
