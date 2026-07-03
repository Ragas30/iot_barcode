import type { TokenRecord, TokenType } from "@/src/types/entities";

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
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">
            Recent {type === "qr" ? "QR" : "Barcode"} Tokens
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Metadata tersimpan, image dihasilkan saat request create.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
          {tokens.length} items
        </div>
      </div>

      {tokens.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
          Belum ada token {type}.
        </div>
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
                    <p className="mt-1 truncate text-xs text-slate-500">{token.token}</p>
                  </div>
                  <span>{formatDate(token.createdAt)}</span>
                  <span>{formatDate(token.expiredAt)}</span>
                  <span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        status === "expired"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {status}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
