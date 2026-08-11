import { TooManyRequestsError } from "@/src/lib/errors";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "anonymous";
  }

  return request.headers.get("x-real-ip") ?? "anonymous";
}

export function enforceRateLimit(
  request: Request,
  key: string,
  limit: number,
  windowMs: number,
) {
  const ip = getClientIp(request);
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  const existing = buckets.get(bucketKey);

  if (!existing || existing.resetAt <= now) {
    buckets.set(bucketKey, {
      count: 1,
      resetAt: now + windowMs,
    });
    return;
  }

  if (existing.count >= limit) {
    throw new TooManyRequestsError();
  }

  existing.count += 1;
}
