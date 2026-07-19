import type { TokenRecord, TokenType } from "@/src/types/entities";
import { getDb } from "@/src/lib/firebase";
import { DatabaseError } from "@/src/lib/errors";

const memoryTokens = new Map<string, TokenRecord>();

export class TokenRepository {
  async create(record: TokenRecord) {
    try {
      const db = getDb();

      if (!db) {
        memoryTokens.set(record.token, record);
        return record;
      }

      await db.collection("tokens").doc(record.id).set(record);
      return record;
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal menyimpan token.${detail}`);
    }
  }

  async findByToken(token: string) {
    try {
      const db = getDb();

      if (!db) {
        return memoryTokens.get(token) ?? null;
      }

      const snapshot = await db
        .collection("tokens")
        .where("token", "==", token)
        .limit(1)
        .get();
      if (snapshot.empty) {
        return null;
      }
      return snapshot.docs[0].data() as TokenRecord;
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal mencari token.${detail}`);
    }
  }

  async listByType(type: TokenType, adminId?: string) {
    try {
      const db = getDb();

      if (!db) {
        return Array.from(memoryTokens.values())
          .filter((item) => (adminId ? item.adminId === adminId : true))
          .filter((item) => item.type === type)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      }

      let query = db.collection("tokens").where("type", "==", type);

      if (adminId) {
        query = query.where("adminId", "==", adminId);
      }

      const snapshot = await query.get();
      return snapshot.docs
        .map((doc) => doc.data() as TokenRecord)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal mengambil daftar token.${detail}`);
    }
  }

  async deleteByType(type: TokenType, adminId: string) {
    try {
      const db = getDb();

      if (!db) {
        for (const [key, value] of memoryTokens.entries()) {
          if (value.type === type && value.adminId === adminId) {
            memoryTokens.delete(key);
          }
        }
        return { deletedCount: 0 };
      }

      const snapshot = await db
        .collection("tokens")
        .where("type", "==", type)
        .where("adminId", "==", adminId)
        .get();

      const batch = db.batch();
      let deletedCount = 0;

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        deletedCount++;
      });

      await batch.commit();
      return { deletedCount };
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? ` Detail: ${error.message}`
          : "";
      throw new DatabaseError(`Gagal menghapus token.${detail}`);
    }
  }
}
