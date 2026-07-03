import { PageShell } from "@/src/components/common/page-shell";
import { TokenList } from "@/src/components/dashboard/token-list";
import { TokenController } from "@/src/controllers/token.controller";
import { requireAuth } from "@/src/middleware/auth";

const controller = new TokenController();

export default async function HistoryQrPage() {
  const auth = await requireAuth();
  const tokens = await controller.list("qr", auth.sub);

  return (
    <PageShell
      title="History QR"
      description="Semua QR yang pernah digenerate user ini disimpan ke Firebase dan bisa dipakai sebagai jejak autentikasi perangkat."
    >
      <TokenList tokens={tokens} type="qr" />
    </PageShell>
  );
}
