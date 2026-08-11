import { hashPassword } from "@/src/lib/bcrypt";
import {
  AuthorizationError,
  ConflictError,
  NotFoundError,
} from "@/src/lib/errors";
import { generateId } from "@/src/lib/utils";
import { AdminRepository } from "@/src/repositories/admin.repository";
import { TokenRepository } from "@/src/repositories/token.repository";
import type { Admin } from "@/src/types/entities";

export type AdminSummary = {
  id: string;
  name: string;
  email: string;
  pinConfigured: boolean;
  createdAt: string;
};

function toAdminSummary(admin: Admin): AdminSummary {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    pinConfigured: Boolean(admin.pin),
    createdAt: admin.createdAt,
  };
}

export class AdminService {
  constructor(
    private readonly adminRepository = new AdminRepository(),
    private readonly tokenRepository = new TokenRepository(),
  ) {}

  async create(payload: { name: string; email: string; password: string }) {
    const existing = await this.adminRepository.findByEmail(payload.email);

    if (existing) {
      throw new ConflictError("Email sudah terdaftar.");
    }

    const admin: Admin = {
      id: generateId(),
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: await hashPassword(payload.password),
      pin: null,
      pinUpdatedAt: null,
      createdAt: new Date().toISOString(),
    };

    const saved = await this.adminRepository.create(admin);
    return toAdminSummary(saved);
  }

  async list() {
    const admins = await this.adminRepository.findAll();
    return admins.map(toAdminSummary);
  }

  async update(
    id: string,
    payload: {
      name?: string;
      email?: string;
      password?: string;
      resetPin?: boolean;
    },
  ) {
    const admin = await this.adminRepository.findById(id);

    if (!admin) {
      throw new NotFoundError("User tidak ditemukan.");
    }

    const updated: Admin = { ...admin };

    if (payload.name !== undefined) {
      updated.name = payload.name;
    }

    if (payload.email !== undefined) {
      const normalizedEmail = payload.email.toLowerCase();

      if (normalizedEmail !== admin.email) {
        const existing = await this.adminRepository.findByEmail(normalizedEmail);

        if (existing) {
          throw new ConflictError("Email sudah terdaftar.");
        }

        updated.email = normalizedEmail;
      }
    }

    if (payload.password !== undefined) {
      updated.password = await hashPassword(payload.password);
    }

    if (payload.resetPin) {
      updated.pin = null;
      updated.pinUpdatedAt = null;
    }

    const saved = await this.adminRepository.update(id, updated);

    if (!saved) {
      throw new NotFoundError("User tidak ditemukan.");
    }

    return toAdminSummary(saved);
  }

  async remove(id: string, actorId: string) {
    if (id === actorId) {
      throw new AuthorizationError("Tidak dapat menghapus akun sendiri.");
    }

    const admin = await this.adminRepository.findById(id);

    if (!admin) {
      throw new NotFoundError("User tidak ditemukan.");
    }

    const seedEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";

    if (admin.email === seedEmail) {
      throw new AuthorizationError("Admin utama tidak dapat dihapus.");
    }

    await this.tokenRepository.deleteByAdmin(id);
    await this.adminRepository.delete(id);

    return { id };
  }
}
