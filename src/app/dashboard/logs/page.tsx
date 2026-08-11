import { PageShell } from "@/src/components/common/page-shell";
import { LoginLogList } from "@/src/components/dashboard/login-log-list";
import { AuthController } from "@/src/controllers/auth.controller";
import { requireAuth } from "@/src/middleware/auth";

const controller = new AuthController();

export default async function LogsPage() {
  await requireAuth();
  const logs = await controller.listLogs();
  const activeCount = logs.filter((log) => log.status === "active").length;

  return (
    <PageShell
      title="Login Log"
      description="Pantau siapa yang sedang login dan riwayat login setiap user, lengkap dengan IP serta perangkat yang dipakai."
    >
      <LoginLogList logs={logs} activeCount={activeCount} />
    </PageShell>
  );
}
