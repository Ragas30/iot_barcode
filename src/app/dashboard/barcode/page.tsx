import { PageShell } from "@/src/components/common/page-shell";
import { TokenGenerator } from "@/src/components/dashboard/token-generator";
import { TokenList } from "@/src/components/dashboard/token-list";
import { TokenController } from "@/src/controllers/token.controller";

const controller = new TokenController();

export default async function BarcodePage() {
  const tokens = await controller.list("barcode");
  return (
    <PageShell
      title="Barcode Token Generator"
      description="Buat barcode Code128 dengan payload validasi yang sama untuk skenario scanner linear."
    >
      <div className="space-y-6">
        <TokenGenerator type="barcode" />
        <TokenList tokens={tokens} type="barcode" />
      </div>
    </PageShell>
  );
}
