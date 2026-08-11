import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/src/constants/auth";
import { AuthService } from "@/src/services/auth.service";
import { loginSchema } from "@/src/validators/auth";
import { setupPinSchema, verifyPinSchema } from "@/src/validators/token";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  async login(
    payload: unknown,
    meta?: { ip?: string | null; userAgent?: string | null },
  ) {
    const parsed = loginSchema.parse(payload);
    const result = await this.authService.login(
      parsed.email,
      parsed.password,
      meta,
    );
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return result.admin;
  }

  async logout(adminId?: string) {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
    await this.authService.logout(adminId);
  }

  async listLogs() {
    return this.authService.listLogs();
  }

  async setupPin(adminId: string, payload: unknown) {
    const parsed = setupPinSchema.parse(payload);
    return this.authService.setupPin(adminId, parsed.pin);
  }

  async verifyPin(payload: unknown) {
    const parsed = verifyPinSchema.parse(payload);
    return this.authService.verifyPin(parsed.adminId, parsed.pin);
  }
}
