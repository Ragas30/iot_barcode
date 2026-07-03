"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(json.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.18)] backdrop-blur"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
        Admin Login
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Smart IoT QR & Barcode
      </h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Gunakan akun admin untuk mengelola token autentikasi perangkat.
      </p>
      <label className="mt-6 block text-sm font-medium text-slate-700">Email</label>
      <input
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
      <input
        type="password"
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Signing in..." : "Masuk ke Dashboard"}
      </button>
    </form>
  );
}
