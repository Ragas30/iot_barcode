import bwipjs from "bwip-js";
import QRCode from "qrcode";
import { ExpiredError, NotFoundError } from "@/src/lib/errors";
import { createExpiryDate, generateId, generateTokenValue, isExpired } from "@/src/lib/utils";
import { TokenRepository } from "@/src/repositories/token.repository";
import type { TokenRecord, TokenType } from "@/src/types/entities";

export class TokenService {
  constructor(private readonly tokenRepository = new TokenRepository()) {}

  async create(adminId: string, name: string, type: TokenType) {
    const token = generateTokenValue();
    const record: TokenRecord = {
      id: generateId(),
      adminId,
      name,
      token,
      type,
      status: "active",
      createdAt: new Date().toISOString(),
      expiredAt: createExpiryDate(1),
    };

    await this.tokenRepository.create(record);

    const payload = token;
    const verifyEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/verify_qr`;
    const image = type === "qr" ? await QRCode.toDataURL(payload) : await this.generateBarcode(payload);

    return {
      ...record,
      image,
      payload,
      verifyEndpoint,
    };
  }

  async list(type: TokenType, adminId?: string) {
    const records = await this.tokenRepository.listByType(type, adminId);
    return records.map((record) => ({
      ...record,
      status: isExpired(record.expiredAt) ? "expired" : record.status,
    }));
  }

  async validate(token: string) {
    const record = await this.tokenRepository.findByToken(token);
    if (!record) {
      throw new NotFoundError("Token tidak ditemukan.");
    }

    if (isExpired(record.expiredAt)) {
      throw new ExpiredError("Token sudah expired.");
    }

    return record;
  }

  async verifyQr(token: string) {
    const record = await this.validate(token);

    if (record.type !== "qr") {
      throw new NotFoundError("Kode QR tidak ditemukan.");
    }

    return {
      valid: true,
      token: record.token,
      adminId: record.adminId,
      name: record.name,
      expiredAt: record.expiredAt,
    };
  }

  private async generateBarcode(text: string) {
    const png = await bwipjs.toBuffer({
      bcid: "code128",
      text,
      scale: 3,
      height: 12,
      includetext: false,
    });

    return `data:image/png;base64,${png.toString("base64")}`;
  }
}
