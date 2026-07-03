import type { TokenRecord, TokenType } from "@/src/types/entities";
import { Card, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { EmptyState } from "@/src/components/ui/empty-state";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatus(token: TokenRecord) {
  const expired = new Date(token.expiredAt).getTime() <= Date.now();
  return expired ? "expired" : token.status;
}

export function TokenList({
  tokens,
  type,
}: {
  tokens: TokenRecord[];
  type: TokenType;
}) {
  const label = type === "qr" ? "QR" : "Barcode";

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <CardTitle>Recent {label} Tokens</CardTitle>
          <CardDescription className="mt-1">
            Metadata tersimpan, image dihasilkan saat request create.
          </CardDescription>
        </div>
        <Badge variant="neutral" className="tracking-[0.24em]">
          {tokens.length} items
        </Badge>
      </div>

      {tokens.length === 0 ? (
        <EmptyState className="mt-6">
          Belum ada token {type}.
        </EmptyState>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
          <div className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr] gap-4 bg-slate-950 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            <span>Name</span>
            <span>Created</span>
            <span>Expired</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-slate-200">
            {tokens.map((token) => {
              const status = getStatus(token);
              return (
                <div
                  key={token.id}
                  className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr] gap-4 px-4 py-4 text-sm text-slate-700"
                >
                  <div>
                    <p className="font-semibold text-slate-950">{token.name}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {token.token}
                    </p>
                  </div>
                  <span>{formatDate(token.createdAt)}</span>
                  <span>{formatDate(token.expiredAt)}</span>
                  <span>
                    <Badge
                      variant={
                        status === "expired" ? "destructive" : "success"
                      }
                    >
                      {status}
                    </Badge>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
