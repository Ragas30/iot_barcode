import { comparePassword, hashPassword } from "@/src/lib/bcrypt";
import { AuthenticationError, NotFoundError } from "@/src/lib/errors";
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
        pinConfigured: Boolean(admin.pin),
        pinUpdatedAt: admin.pinUpdatedAt ?? null,
      },
    };
  }

  async setupPin(adminId: string, pin: string) {
    const hashedPin = await hashPassword(pin);
    const admin = await this.adminRepository.updatePin(adminId, hashedPin);

    if (!admin) {
      throw new NotFoundError("Admin tidak ditemukan.");
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      pinConfigured: Boolean(admin.pin),
      pinUpdatedAt: admin.pinUpdatedAt ?? null,
    };
  }

  async verifyPin(adminId: string, pin: string) {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin || !admin.pin) {
      throw new AuthenticationError("PIN belum diatur.");
    }

    const isMatch = await comparePassword(pin, admin.pin);

    if (!isMatch) {
      throw new AuthenticationError("Incorrect pin");
    }

    return {
      valid: true,
      adminId: admin.id,
      name: admin.name,
    };
  }
}
