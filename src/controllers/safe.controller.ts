import { SafeService } from "@/src/services/safe.service";
import { openSafeSchema } from "@/src/validators/safe";

export class SafeController {
  constructor(private readonly safeService = new SafeService()) {}

  async open(payload: unknown) {
    const parsed = openSafeSchema.parse(payload);
    return this.safeService.open(parsed.token);
  }

  async listLogs() {
    return this.safeService.listLogs();
  }

  async clearLogs() {
    return this.safeService.clearLogs();
  }
}
