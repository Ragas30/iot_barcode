import { comparePassword } from "@/src/lib/bcrypt";
import { AuthenticationError } from "@/src/lib/errors";
import { signAuthToken } from "@/src/lib/jwt";
import { AdminRepository } from "@/src/repositories/admin.repository";

export class AuthService {
  constructor(private readonly adminRepository = new AdminRepository()) {}

  async login(email: string, password: string) {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new AuthenticationError("Email atau password salah.");
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      throw new AuthenticationError("Email atau password salah.");
    }

    const token = await signAuthToken({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
    });

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  }
}
