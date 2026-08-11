import type { LoginLog } from "@/src/types/entities";
import { getDb } from "@/src/lib/firebase";
import { DatabaseError } from "@/src/lib/errors";

const memoryLogs = new Map<string, LoginLog>();

export class LoginLogRepository {
  async create(log: LoginLog) {
    try {
      const db = getDb();

      if (!db) {
        memoryLogs.set(log.id, log);
        return log;
      }

      await db.collection("login_logs").doc(log.id).set(log);
      return log;
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal menyimpan log login.${detail}`);
    }
  }

  async listRecent(limit = 100) {
    try {
      const db = getDb();

      if (!db) {
        return Array.from(memoryLogs.values())
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, limit);
      }

      const snapshot = await db
        .collection("login_logs")
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => doc.data() as LoginLog);
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal mengambil log login.${detail}`);
    }
  }

  async endByAdmin(adminId: string) {
    try {
      const db = getDb();

      if (!db) {
        for (const log of memoryLogs.values()) {
          if (log.adminId === adminId && !log.endedAt) {
            log.endedAt = new Date().toISOString();
          }
        }
        return;
      }

      const snapshot = await db
        .collection("login_logs")
        .where("adminId", "==", adminId)
        .where("endedAt", "==", null)
        .get();

      const batch = db.batch();
      snapshot.docs.forEach((doc) =>
        batch.update(doc.ref, { endedAt: new Date().toISOString() }),
      );
      await batch.commit();
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal mengakhiri sesi login.${detail}`);
    }
  }
}
