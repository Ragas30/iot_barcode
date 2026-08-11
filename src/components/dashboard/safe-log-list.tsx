"use client";

import { useState } from "react";
import type { SafeOpenLog } from "@/src/types/entities";
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

export function SafeLogList({ logs: initialLogs }: { logs: SafeOpenLog[] }) {
  const [logs, setLogs] = useState(initialLogs);
  const [isClearing, setIsClearing] = useState(false);

  const handleClear = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus semua riwayat buka brankas?")) {
      return;
    }

    try {
      setIsClearing(true);
      const response = await fetch("/api/safe/logs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus riwayat brankas");
      }

      setLogs([]);
    } catch (error) {
      console.error("Error clearing safe logs:", error);
      alert("Gagal menghapus riwayat brankas. Silakan coba lagi.");
    } finally {
      setIsClearing(false);
    }
  };

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
        <div className="flex items-center gap-2">
          <Badge variant="success" className="tracking-[0.24em]">
            {logs.length} kali
          </Badge>
          {logs.length > 0 && (
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
