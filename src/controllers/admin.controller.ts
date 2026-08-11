import { AdminService } from "@/src/services/admin.service";
import {
  createAdminSchema,
  updateAdminSchema,
} from "@/src/validators/admin";

export class AdminController {
  constructor(private readonly adminService = new AdminService()) {}

  async create(payload: unknown) {
    const parsed = createAdminSchema.parse(payload);
    return this.adminService.create(parsed);
  }

  async list() {
    return this.adminService.list();
  }

  async update(id: string, payload: unknown) {
    const parsed = updateAdminSchema.parse(payload);
    return this.adminService.update(id, parsed);
  }

  async remove(id: string, actorId: string) {
    return this.adminService.remove(id, actorId);
  }
}
