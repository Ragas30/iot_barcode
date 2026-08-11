import Link from "next/link";
import { PageShell } from "@/src/components/common/page-shell";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

const cards = [
  {
    title: "Generate QR",
    description:
      "Buat QR autentikasi baru dan simpan record-nya ke Firebase untuk dipakai alat.",
    href: "/dashboard/qr",
    cta: "Buka Generator",
  },
  {
    title: "History QR",
    description:
      "Lihat semua QR yang pernah dibuat user ini beserta status aktif atau expired.",
    href: "/dashboard/history-qr",
    cta: "Lihat History",
  },
  {
    title: "Setup PIN",
    description:
      "Atur PIN akun yang akan diverifikasi alat sebelum sesi scan QR dimulai.",
    href: "/dashboard/pin",
    cta: "Atur PIN",
  },
  {
    title: "Manajemen User",
    description:
      "Tambahkan akun admin baru atau hapus akun yang sudah tidak dipakai.",
    href: "/dashboard/users",
    cta: "Kelola User",
  },
  {
    title: "Login Log",
    description:
      "Lihat siapa yang sedang login dan riwayat login tiap user beserta perangkatnya.",
    href: "/dashboard/logs",
    cta: "Lihat Log",
  },
];

export default function DashboardPage() {
  return (
    <PageShell
      title="Dashboard Overview"
      description="Flow utama sistem sekarang berpusat di PIN alat dan autentikasi QR. Semua data user, PIN, dan QR disimpan ke Firebase."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardContent>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription className="mt-3">
                {card.description}
              </CardDescription>
              <Link href={card.href} className="mt-5 inline-block">
                <Button size="pill">{card.cta}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
