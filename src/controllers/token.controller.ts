import { TokenService } from "@/src/services/token.service";
import type { TokenType } from "@/src/types/entities";
import { createTokenSchema, verifyTokenSchema } from "@/src/validators/token";

export class TokenController {
  constructor(private readonly tokenService = new TokenService()) {}

  async create(adminId: string, payload: unknown, type: TokenType) {
    const parsed = createTokenSchema.parse(payload);
    return this.tokenService.create(adminId, parsed.name, type);
  }

  async list(type: TokenType, adminId?: string) {
    return this.tokenService.list(type, adminId);
  }

  async validate(token: string) {
    return this.tokenService.validate(token);
  }

  async verifyQr(payload: unknown) {
    const parsed = verifyTokenSchema.parse(payload);
    return this.tokenService.verifyQr(parsed.token);
  }

  async clearByType(type: TokenType, adminId: string) {
    return this.tokenService.clearByType(type, adminId);
  }
}
