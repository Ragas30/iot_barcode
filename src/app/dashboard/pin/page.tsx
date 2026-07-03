import { PageShell } from "@/src/components/common/page-shell";
import { PinSetupForm } from "@/src/components/dashboard/pin-setup-form";
import { AdminRepository } from "@/src/repositories/admin.repository";
import { requireAuth } from "@/src/middleware/auth";

const adminRepository = new AdminRepository();

export default async function PinPage() {
  const auth = await requireAuth();
  const admin = await adminRepository.findById(auth.sub);

  if (!admin) {
    return null;
  }

  return (
    <PageShell
      title="Setup PIN"
      description="Simpan PIN perangkat per akun. Nilainya di-hash lalu disimpan ke Firebase agar alat dapat memverifikasi akses sebelum proses scan QR."
    >
      <PinSetupForm
        profile={{
          id: admin.id,
          email: admin.email,
          name: admin.name,
          pinConfigured: Boolean(admin.pin),
          pinUpdatedAt: admin.pinUpdatedAt ?? null,
        }}
      />
    </PageShell>
  );
}
