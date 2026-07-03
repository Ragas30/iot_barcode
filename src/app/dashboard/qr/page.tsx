import { PageShell } from "@/src/components/common/page-shell";
import { TokenGenerator } from "@/src/components/dashboard/token-generator";

export default async function QrPage() {
  return (
    <PageShell
      title="Generate QR"
      description="Buat QR baru untuk proses autentikasi alat. Data QR disimpan ke Firebase dan bisa diverifikasi oleh endpoint `verify_qr`."
    >
      <TokenGenerator type="qr" />
    </PageShell>
  );
}
