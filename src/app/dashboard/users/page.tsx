import { PageShell } from "@/src/components/common/page-shell";
import { UserManagement } from "@/src/components/dashboard/user-management";
import { AdminController } from "@/src/controllers/admin.controller";
import { requireAuth } from "@/src/middleware/auth";

const controller = new AdminController();

export default async function UsersPage() {
  const auth = await requireAuth();
  const users = await controller.list();

  return (
    <PageShell
      title="Manajemen User"
      description="Admin dapat menambahkan akun baru atau menghapus akun yang sudah tidak dipakai. Admin utama tidak bisa dihapus."
    >
      <UserManagement users={users} currentAdminId={auth.sub} />
    </PageShell>
  );
}
