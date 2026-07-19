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

  async verifyPin(pin: string) {
    const admins = await this.adminRepository.findByPin(pin);

    if (!admins || admins.length === 0) {
      throw new AuthenticationError("PIN tidak valid.");
    }

    // Find the admin with matching PIN
    let matchedAdmin: any = null;
    for (const admin of admins) {
      if (admin.pin) {
        const isMatch = await comparePassword(pin, admin.pin);
        if (isMatch) {
          matchedAdmin = admin;
          break;
        }
      }
    }

    if (!matchedAdmin) {
      throw new AuthenticationError("PIN tidak valid.");
    }

    return {
      valid: true,
      adminId: matchedAdmin.id,
      name: matchedAdmin.name,
    };
  }
}
