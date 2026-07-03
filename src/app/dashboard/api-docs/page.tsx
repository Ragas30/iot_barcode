import { PageShell } from "@/src/components/common/page-shell";
import { ApiReference } from "@/src/components/dashboard/api-reference";

export default function ApiDocsPage() {
  return (
    <PageShell
      title="API Reference"
      description="Dokumentasi lengkap semua endpoint API beserta contoh request dan response. Gunakan sebagai referensi saat integrasi dengan IoT device."
    >
      <ApiReference />
    </PageShell>
  );
}
