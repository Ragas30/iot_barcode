import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/src/constants/auth";
import { AuthService } from "@/src/services/auth.service";
import { loginSchema } from "@/src/validators/auth";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  async login(payload: unknown) {
    const parsed = loginSchema.parse(payload);
    const result = await this.authService.login(parsed.email, parsed.password);
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

  async logout() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
  }
}
