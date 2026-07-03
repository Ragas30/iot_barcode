import { PageShell } from "@/src/components/common/page-shell";
import { TokenGenerator } from "@/src/components/dashboard/token-generator";
import { TokenList } from "@/src/components/dashboard/token-list";
import { TokenController } from "@/src/controllers/token.controller";

const controller = new TokenController();

export default async function QrPage() {
  const tokens = await controller.list("qr");
  return (
    <PageShell
      title="QR Token Generator"
      description="Buat token QR baru untuk perangkat atau checkpoint. Masa aktif token otomatis berakhir setelah 1 menit."
    >
      <div className="space-y-6">
        <TokenGenerator type="qr" />
        <TokenList tokens={tokens} type="qr" />
      </div>
    </PageShell>
  );
}
