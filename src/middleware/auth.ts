import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/src/constants/auth";
import { AuthenticationError } from "@/src/lib/errors";
import { verifyAuthToken } from "@/src/lib/jwt";

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    throw new AuthenticationError("Silakan login terlebih dahulu.");
  }

  return verifyAuthToken(token);
}
