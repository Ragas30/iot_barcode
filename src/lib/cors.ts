import { NextResponse } from "next/server";

const DEFAULT_METHODS = "GET,POST,OPTIONS";
const DEFAULT_HEADERS = "Content-Type, Authorization";

function getAllowedOrigins() {
  return (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function resolveAllowedOrigin(request?: Request) {
  const requestOrigin = request?.headers.get("origin");
  const allowedOrigins = getAllowedOrigins();

  if (!requestOrigin) {
    return allowedOrigins[0] ?? "*";
  }

  if (allowedOrigins.length === 0) {
    return "*";
  }

  return allowedOrigins.includes(requestOrigin) ? requestOrigin : null;
}

export function applyCors(response: NextResponse, request?: Request) {
  const allowedOrigin = resolveAllowedOrigin(request);

  if (allowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  }

  response.headers.set("Access-Control-Allow-Methods", DEFAULT_METHODS);
  response.headers.set("Access-Control-Allow-Headers", DEFAULT_HEADERS);
  response.headers.set("Vary", "Origin");

  if (allowedOrigin && allowedOrigin !== "*") {
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}

export function createCorsPreflightResponse(request: Request) {
  return applyCors(new NextResponse(null, { status: 204 }), request);
}
