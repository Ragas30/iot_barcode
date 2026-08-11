import type { LoginLogItem } from "@/src/services/auth.service";
import { Card, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { EmptyState } from "@/src/components/ui/empty-state";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getVariant(status: LoginLogItem["status"]) {
  if (status === "active") return "success";
  if (status === "expired") return "destructive";
  return "neutral";
}

export function LoginLogList({
  logs,
  activeCount,
}: {
  logs: LoginLogItem[];
  activeCount: number;
}) {
  return (
    <div className="grid gap-6">
      <Card variant="outlined">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Sesi Login Aktif</CardTitle>
            <CardDescription className="mt-1">
              User yang sedang login dan belum logout / belum kadaluarsa.
            </CardDescription>
          </div>
          <Badge variant="success" className="tracking-[0.24em]">
            {activeCount} online
          </Badge>
        </div>

        {logs.filter((log) => log.status === "active").length === 0 ? (
          <EmptyState className="mt-6">Tidak ada user yang sedang login.</EmptyState>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {logs
              .filter((log) => log.status === "active")
              .map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {log.name}
                      <span className="ml-2 font-medium text-slate-500">
                        {log.email}
                      </span>
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      Login {formatDate(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Riwayat Login</CardTitle>
            <CardDescription className="mt-1">
              Deteksi aktivitas login tiap user, termasuk IP dan perangkat.
            </CardDescription>
          </div>
          <Badge variant="neutral" className="tracking-[0.24em]">
            {logs.length} logs
          </Badge>
        </div>

        {logs.length === 0 ? (
          <EmptyState className="mt-6">Belum ada aktivitas login.</EmptyState>
        ) : (
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
            <div className="grid grid-cols-[1.2fr_1fr_0.8fr_1.4fr_1fr_0.7fr] gap-4 bg-slate-950 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              <span>Nama</span>
              <span>Email</span>
              <span>IP</span>
              <span>Perangkat</span>
              <span>Login</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-slate-200">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-[1.2fr_1fr_0.8fr_1.4fr_1fr_0.7fr] items-center gap-4 px-4 py-4 text-sm text-slate-700"
                >
                  <p className="truncate font-semibold text-slate-950">
                    {log.name}
                  </p>
                  <span className="truncate">{log.email}</span>
                  <span className="truncate">{log.ip ?? "-"}</span>
                  <span className="truncate" title={log.userAgent ?? ""}>
                    {log.userAgent ?? "-"}
                  </span>
                  <span>{formatDate(log.createdAt)}</span>
                  <span>
                    <Badge variant={getVariant(log.status)}>
                      {log.status}
                    </Badge>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
