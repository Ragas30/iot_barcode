"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input, Label, FormMessage } from "@/src/components/ui/input";

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
    <Card
      variant="outlined"
      className="bg-white/90 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.18)] backdrop-blur"
    >
      <form onSubmit={onSubmit}>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
          Admin Login
        </p>
        <CardTitle as="h1" className="mt-3">
          Smart IoT QR &amp; Barcode
        </CardTitle>
        <CardDescription className="mt-3">
          Gunakan akun admin untuk mengelola token autentikasi perangkat.
        </CardDescription>
        <Label className="mt-6">Email</Label>
        <Input
          className="mt-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Label className="mt-4">Password</Label>
        <Input
          type="password"
          className="mt-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <FormMessage>{error}</FormMessage>
        <Button type="submit" loading={loading} className="mt-6 w-full">
          {loading ? "Signing in..." : "Masuk ke Dashboard"}
        </Button>
      </form>
    </Card>
  );
}
