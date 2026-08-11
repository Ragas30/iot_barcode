import { generateId } from "@/src/lib/utils";
import { AdminRepository } from "@/src/repositories/admin.repository";
import { SafeLogRepository } from "@/src/repositories/safe-log.repository";
import { TokenService } from "@/src/services/token.service";
import type { SafeOpenLog } from "@/src/types/entities";

export class SafeService {
  constructor(
    private readonly tokenService = new TokenService(),
    private readonly safeLogRepository = new SafeLogRepository(),
    private readonly adminRepository = new AdminRepository(),
  ) {}

  async open(token: string) {
    const record = await this.tokenService.validate(token);
    const admin = await this.adminRepository.findById(record.adminId);

    const log: SafeOpenLog = {
      id: generateId(),
      tokenId: record.id,
      token: record.token,
      tokenName: record.name,
      adminId: record.adminId,
      adminName: admin?.name ?? "Unknown",
      status: "opened",
      openedAt: new Date().toISOString(),
    };

    await this.safeLogRepository.create(log);

    return {
      safe: log.status,
      openedAt: log.openedAt,
      token: record.token,
      tokenName: record.name,
      adminId: record.adminId,
      adminName: log.adminName,
    };
  }

  async listLogs(limit = 100) {
    return this.safeLogRepository.listRecent(limit);
  }
}
