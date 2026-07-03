"use client";

import Image from "next/image";
import { useState } from "react";

type GeneratedToken = {
  id: string;
  name: string;
  token: string;
  image: string;
  payload: string;
  expiredAt: string;
};

export function TokenGenerator({ type }: { type: "qr" | "barcode" }) {
  const [name, setName] = useState("");
  const [result, setResult] = useState<GeneratedToken | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(`/api/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    const json = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(json.message);
      return;
    }

    setResult(json.data);
    setName("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <form
        onSubmit={onSubmit}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]"
      >
        <h3 className="text-lg font-semibold text-slate-950">
          Generate {type === "qr" ? "QR" : "Barcode"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Token akan aktif selama 1 menit dan cocok untuk validasi perangkat IoT.
        </p>
        <label className="mt-6 block text-sm font-medium text-slate-700">
          Nama item
        </label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Contoh: Pintu Gudang A"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 transition focus:border-slate-950"
        />
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Generating..." : `Generate ${type === "qr" ? "QR" : "Barcode"}`}
        </button>
      </form>

      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-6">
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
              <p><span className="font-semibold">Nama:</span> {result.name}</p>
              <p><span className="font-semibold">Token:</span> {result.token}</p>
              <p><span className="font-semibold">Payload:</span> {result.payload}</p>
              <p><span className="font-semibold">Expired:</span> {new Date(result.expiredAt).toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-80 items-center justify-center rounded-[1.5rem] bg-[radial-gradient(circle_at_top,#e2e8f0,transparent_60%)] text-center text-sm leading-7 text-slate-500">
            Hasil generate akan muncul di sini.
          </div>
        )}
      </div>
    </div>
  );
}
