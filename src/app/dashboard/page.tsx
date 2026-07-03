import { PageShell } from "@/src/components/common/page-shell";

const cards = [
  {
    title: "Auth Flow",
    description: "JWT disimpan pada HttpOnly cookie untuk akses dashboard admin.",
  },
  {
    title: "Token Generator",
    description: "QR dan barcode dibuat on-demand, metadata disimpan, image tidak disimpan.",
  },
  {
    title: "Validation API",
    description: "Perangkat IoT cukup memanggil endpoint validate dengan token aktif.",
  },
];

export default function DashboardPage() {
  return (
    <PageShell
      title="Dashboard Overview"
      description="Fondasi sistem sudah disusun mengikuti PRD: layered architecture, auth middleware, generator QR/barcode, dan endpoint validasi token."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
          >
            <h2 className="text-lg font-semibold text-slate-950">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
