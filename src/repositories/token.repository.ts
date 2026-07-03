import type { TokenRecord, TokenType } from "@/src/types/entities";
import { getDb } from "@/src/lib/firebase";
import { DatabaseError } from "@/src/lib/errors";

const memoryTokens = new Map<string, TokenRecord>();

export class TokenRepository {
  async create(record: TokenRecord) {
    const db = getDb();

    if (!db) {
      memoryTokens.set(record.token, record);
      return record;
    }

    try {
      await db.collection("tokens").doc(record.id).set(record);
      return record;
    } catch {
      throw new DatabaseError("Gagal menyimpan token.");
    }
  }

  async findByToken(token: string) {
    const db = getDb();

    if (!db) {
      return memoryTokens.get(token) ?? null;
    }

    try {
      const snapshot = await db
        .collection("tokens")
        .where("token", "==", token)
        .limit(1)
        .get();
      if (snapshot.empty) {
        return null;
      }
      return snapshot.docs[0].data() as TokenRecord;
    } catch {
      throw new DatabaseError("Gagal mencari token.");
    }
  }

  async listByType(type: TokenType) {
    const db = getDb();

    if (!db) {
      return Array.from(memoryTokens.values())
        .filter((item) => item.type === type)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    try {
      const snapshot = await db
        .collection("tokens")
        .where("type", "==", type)
        .get();
      return snapshot.docs
        .map((doc) => doc.data() as TokenRecord)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch {
      throw new DatabaseError("Gagal mengambil daftar token.");
    }
  }
}
