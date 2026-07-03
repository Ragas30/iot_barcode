"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { FormMessage } from "@/src/components/ui/input";
import { EmptyState } from "@/src/components/ui/empty-state";

type GeneratedToken = {
  id: string;
  name: string;
  token: string;
  image: string;
  payload: string;
  verifyEndpoint: string;
  expiredAt: string;
};

export function TokenGenerator({ type }: { type: "qr" }) {
  const [result, setResult] = useState<GeneratedToken | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onGenerate() {
    setLoading(true);
    setError("");

    const response = await fetch(`/api/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const json = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(json.message);
      return;
    }

    setResult(json.data);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <Card variant="outlined">
        <CardTitle>Generate QR</CardTitle>
        <CardDescription className="mt-2">
          Tekan tombol di bawah untuk membuat QR baru. Token akan aktif selama 1
          menit dan berisi token mentah yang harus dikirim alat ke endpoint
          verifikasi.
        </CardDescription>
        <FormMessage>{error}</FormMessage>
        <Button
          type="button"
          loading={loading}
          onClick={onGenerate}
          className="mt-6 w-full"
        >
          {loading ? "Generating..." : "Generate QR"}
        </Button>
      </Card>

      <Card variant="dashed">
        {result ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
              <Image
                src={result.image}
                alt={`${type} preview`}
                width={640}
                height={640}
                unoptimized
                className="max-h-80 w-auto"
              />
            </div>
            <div className="grid gap-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Token:</span> {result.token}
              </p>
              <p>
                <span className="font-semibold">Payload QR:</span>{" "}
                {result.payload}
              </p>
              <p>
                <span className="font-semibold">Verify API:</span>{" "}
                {result.verifyEndpoint}
              </p>
              <p>
                <span className="font-semibold">Expired:</span>{" "}
                {new Date(result.expiredAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <EmptyState variant="gradient">
            Hasil generate akan muncul di sini.
          </EmptyState>
        )}
      </Card>
    </div>
  );
}
