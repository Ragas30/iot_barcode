import { PageShell } from "@/src/components/common/page-shell";
import { SafeLogList } from "@/src/components/dashboard/safe-log-list";
import { SafeController } from "@/src/controllers/safe.controller";
import { requireAuth } from "@/src/middleware/auth";

const controller = new SafeController();

export default async function SafePage() {
  await requireAuth();
  const logs = await controller.listLogs();

  return (
    <PageShell
      title="Safe History"
      description="Riwayat brankas yang berhasil dibuka melalui barcode yang sukses dipindai oleh perangkat IoT."
    >
      <SafeLogList logs={logs} />
    </PageShell>
  );
}
