import { SignJWT, jwtVerify } from "jose";
import { AuthenticationError } from "@/src/lib/errors";
import type { AuthPayload } from "@/src/types/entities";

const SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const secretKey = new TextEncoder().encode(SECRET);

export async function signAuthToken(payload: AuthPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey);
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as AuthPayload;
  } catch {
    throw new AuthenticationError("JWT tidak valid.");
  }
}
