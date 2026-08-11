"use client";

import { useState } from "react";
import type { TokenRecord, TokenType } from "@/src/types/entities";
import { Card, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Button } from "@/src/components/ui/button";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

function getStatus(token: TokenRecord) {
  const expired = new Date(token.expiredAt).getTime() <= Date.now();
  return expired ? "expired" : token.status;
}

export function TokenList({
  tokens: initialTokens,
  type,
}: {
  tokens: TokenRecord[];
  type: TokenType;
}) {
  const [tokens, setTokens] = useState(initialTokens);
  const [isClearing, setIsClearing] = useState(false);
  const label = type === "qr" ? "QR" : "Barcode";

  const handleClear = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus semua ${label} tokens?`)) {
      return;
    }

    try {
      setIsClearing(true);
      const response = await fetch("/api/token/clear", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus tokens");
      }

      setTokens([]);
    } catch (error) {
      console.error("Error clearing tokens:", error);
      alert("Gagal menghapus tokens. Silakan coba lagi.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <CardTitle>Recent {label} Tokens</CardTitle>
          <CardDescription className="mt-1">
            Metadata tersimpan, image dihasilkan saat request create.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="neutral" className="tracking-[0.24em]">
            {tokens.length} items
          </Badge>
          {tokens.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClear}
              disabled={isClearing}
            >
              {isClearing ? "Clearing..." : "Clear"}
            </Button>
          )}
        </div>
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
