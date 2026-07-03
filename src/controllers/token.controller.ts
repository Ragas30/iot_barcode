import { TokenService } from "@/src/services/token.service";
import type { TokenType } from "@/src/types/entities";
import { createTokenSchema } from "@/src/validators/token";

export class TokenController {
  constructor(private readonly tokenService = new TokenService()) {}

  async create(payload: unknown, type: TokenType) {
    const parsed = createTokenSchema.parse(payload);
    return this.tokenService.create(parsed.name, type);
  }

  async list(type: TokenType) {
    return this.tokenService.list(type);
  }

  async validate(token: string) {
    return this.tokenService.validate(token);
  }
}
