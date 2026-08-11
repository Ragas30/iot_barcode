import type { SafeOpenLog } from "@/src/types/entities";
import { Card, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { EmptyState } from "@/src/components/ui/empty-state";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SafeLogList({ logs }: { logs: SafeOpenLog[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <CardTitle>Riwayat Buka Brankas</CardTitle>
          <CardDescription className="mt-1">
            Setiap brankas yang berhasil dibuka setelah barcode berhasil
            dipindai dan divalidasi.
          </CardDescription>
        </div>
        <Badge variant="success" className="tracking-[0.24em]">
          {logs.length} kali
        </Badge>
      </div>

      {logs.length === 0 ? (
        <EmptyState className="mt-6">
          Belum ada aktivitas buka brankas.
        </EmptyState>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
          <div className="grid grid-cols-[1.2fr_1.4fr_1.4fr_1fr_0.7fr] gap-4 bg-slate-950 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            <span>Admin</span>
            <span>Token</span>
            <span>Nama Token</span>
            <span>Dibuka</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-slate-200">
            {logs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-[1.2fr_1.4fr_1.4fr_1fr_0.7fr] items-center gap-4 px-4 py-4 text-sm text-slate-700"
              >
                <p className="truncate font-semibold text-slate-950">
                  {log.adminName}
                </p>
                <span className="truncate" title={log.token}>
                  {log.token}
                </span>
                <span className="truncate">{log.tokenName}</span>
                <span>{formatDate(log.openedAt)}</span>
                <span>
                  <Badge variant="success">{log.status}</Badge>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
