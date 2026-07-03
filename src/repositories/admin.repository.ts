import type { Admin } from "@/src/types/entities";
import { getDb } from "@/src/lib/firebase";
import { DatabaseError } from "@/src/lib/errors";
import { hashPassword } from "@/src/lib/bcrypt";
import { generateId } from "@/src/lib/utils";

const memoryAdmins = new Map<string, Admin>();

async function ensureSeededAdmin() {
  if (memoryAdmins.size > 0) {
    return;
  }

  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
  const hashed = await hashPassword(password);
  const now = new Date().toISOString();
  const admin: Admin = {
    id: generateId(),
    name: "System Admin",
    email,
    password: hashed,
    pin: null,
    pinUpdatedAt: null,
    createdAt: now,
  };
  memoryAdmins.set(admin.email, admin);
}

async function buildSeedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
  const hashed = await hashPassword(password);
  const now = new Date().toISOString();

  return {
    id: generateId(),
    name: "System Admin",
    email,
    password: hashed,
    pin: null,
    pinUpdatedAt: null,
    createdAt: now,
  } satisfies Admin;
}

export class AdminRepository {
  private async ensureFirestoreSeededAdmin(email: string) {
    const db = getDb();

    if (!db) {
      return null;
    }

    const seedEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
    if (email !== seedEmail) {
      return null;
    }

    const seedAdmin = await buildSeedAdmin();

    try {
      await db.collection("admins").doc(seedAdmin.id).set(seedAdmin);
      return seedAdmin;
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal membuat admin awal.${detail}`);
    }
  }

  async findByEmail(email: string) {
    try {
      const db = getDb();

      if (!db) {
        await ensureSeededAdmin();
        return memoryAdmins.get(email) ?? null;
      }

      const snapshot = await db
        .collection("admins")
        .where("email", "==", email)
        .limit(1)
        .get();
      if (snapshot.empty) {
        return this.ensureFirestoreSeededAdmin(email);
      }
      return snapshot.docs[0].data() as Admin;
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal mencari admin.${detail}`);
    }
  }

  async findById(id: string) {
    try {
      const db = getDb();

      if (!db) {
        await ensureSeededAdmin();
        return Array.from(memoryAdmins.values()).find((admin) => admin.id === id) ?? null;
      }

      const snapshot = await db.collection("admins").doc(id).get();

      if (!snapshot.exists) {
        return null;
      }

      return snapshot.data() as Admin;
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal mencari admin berdasarkan id.${detail}`);
    }
  }

  async updatePin(id: string, pin: string) {
    const admin = await this.findById(id);

    if (!admin) {
      return null;
    }

    const updatedAdmin: Admin = {
      ...admin,
      pin,
      pinUpdatedAt: new Date().toISOString(),
    };

    try {
      const db = getDb();

      if (!db) {
        memoryAdmins.set(updatedAdmin.email, updatedAdmin);
        return updatedAdmin;
      }

      await db.collection("admins").doc(updatedAdmin.id).set(updatedAdmin);
      return updatedAdmin;
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal menyimpan PIN admin.${detail}`);
    }
  }
}
