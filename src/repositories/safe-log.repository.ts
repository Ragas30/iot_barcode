import type { SafeOpenLog } from "@/src/types/entities";
import { getDb } from "@/src/lib/firebase";
import { DatabaseError } from "@/src/lib/errors";

const memoryLogs = new Map<string, SafeOpenLog>();

export class SafeLogRepository {
  async create(log: SafeOpenLog) {
    try {
      const db = getDb();

      if (!db) {
        memoryLogs.set(log.id, log);
        return log;
      }

      await db.collection("safe_logs").doc(log.id).set(log);
      return log;
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal menyimpan log brankas.${detail}`);
    }
  }

  async listRecent(limit = 100) {
    try {
      const db = getDb();

      if (!db) {
        return Array.from(memoryLogs.values())
          .sort((a, b) => b.openedAt.localeCompare(a.openedAt))
          .slice(0, limit);
      }

      const snapshot = await db
        .collection("safe_logs")
        .orderBy("openedAt", "desc")
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => doc.data() as SafeOpenLog);
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal mengambil log brankas.${detail}`);
    }
  }

  async clearAll() {
    try {
      const db = getDb();

      if (!db) {
        const deletedCount = memoryLogs.size;
        memoryLogs.clear();
        return { deletedCount };
      }

      const snapshot = await db.collection("safe_logs").get();
      const batch = db.batch();
      let deletedCount = 0;

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        deletedCount += 1;
      });

      if (deletedCount > 0) {
        await batch.commit();
      }

      return { deletedCount };
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal menghapus log brankas.${detail}`);
    }
  }
}
