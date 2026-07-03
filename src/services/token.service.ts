import bwipjs from "bwip-js";
import QRCode from "qrcode";
import { ExpiredError, NotFoundError } from "@/src/lib/errors";
import { createExpiryDate, generateId, generateTokenValue, isExpired } from "@/src/lib/utils";
import { TokenRepository } from "@/src/repositories/token.repository";
import type { TokenRecord, TokenType } from "@/src/types/entities";

export class TokenService {
  constructor(private readonly tokenRepository = new TokenRepository()) {}

  async create(name: string, type: TokenType) {
    const token = generateTokenValue();
    const record: TokenRecord = {
      id: generateId(),
      name,
      token,
      type,
      status: "active",
      createdAt: new Date().toISOString(),
      expiredAt: createExpiryDate(1),
    };

    await this.tokenRepository.create(record);

    const payload = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/validate?token=${token}`;
    const image = type === "qr" ? await QRCode.toDataURL(payload) : await this.generateBarcode(payload);

    return {
      ...record,
      image,
      payload,
    };
  }

  async list(type: TokenType) {
    const records = await this.tokenRepository.listByType(type);
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
