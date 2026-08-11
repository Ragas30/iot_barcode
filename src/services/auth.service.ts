import { comparePassword, hashPassword } from "@/src/lib/bcrypt";
import { AuthenticationError, NotFoundError } from "@/src/lib/errors";
import { signAuthToken } from "@/src/lib/jwt";
import { generateId } from "@/src/lib/utils";
import { AdminRepository } from "@/src/repositories/admin.repository";
import { LoginLogRepository } from "@/src/repositories/login-log.repository";
import type { Admin } from "@/src/types/entities";

export type LoginLogStatus = "active" | "expired" | "ended";

export type LoginLogItem = {
  id: string;
  adminId: string;
  name: string;
  email: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
  status: LoginLogStatus;
};

function getLogStatus(log: {
  expiresAt: string;
  endedAt: string | null;
}): LoginLogStatus {
  if (log.endedAt) {
    return "ended";
  }

  if (new Date(log.expiresAt).getTime() <= Date.now()) {
    return "expired";
  }

  return "active";
}

export class AuthService {
  constructor(
    private readonly adminRepository = new AdminRepository(),
    private readonly loginLogRepository = new LoginLogRepository(),
  ) {}

  async login(
    email: string,
    password: string,
    meta?: { ip?: string | null; userAgent?: string | null },
  ) {
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

    const now = new Date();
    await this.loginLogRepository.create({
      id: generateId(),
      adminId: admin.id,
      name: admin.name,
      email: admin.email,
      ip: meta?.ip ?? null,
      userAgent: meta?.userAgent ?? null,
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      endedAt: null,
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

  async logout(adminId?: string) {
    if (adminId) {
      await this.loginLogRepository.endByAdmin(adminId);
    }
  }

  async listLogs(limit = 100) {
    const logs = await this.loginLogRepository.listRecent(limit);
    return logs.map(
      (log): LoginLogItem => ({
        id: log.id,
        adminId: log.adminId,
        name: log.name,
        email: log.email,
        ip: log.ip,
        userAgent: log.userAgent,
        createdAt: log.createdAt,
        expiresAt: log.expiresAt,
        status: getLogStatus(log),
      }),
    );
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

  async verifyPin(adminId: string | undefined, pin: string) {
    const admins = adminId
      ? [await this.adminRepository.findById(adminId)].filter(
          (admin): admin is NonNullable<typeof admin> => Boolean(admin),
        )
      : await this.adminRepository.findAll();

    let matched: Admin | null = null;

    for (const candidate of admins) {
      if (!candidate.pin) {
        continue;
      }

      if (await comparePassword(pin, candidate.pin)) {
        matched = candidate;
        break;
      }
    }

    if (!matched) {
      throw new AuthenticationError("PIN salah atau belum diatur.");
    }

    return {
      valid: true,
      adminId: matched.id,
      name: matched.name,
    };
  }
}
