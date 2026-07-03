"use client";

import { useState } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input, Label, FormMessage } from "@/src/components/ui/input";

type PinProfile = {
  id: string;
  email: string;
  name: string;
  pinConfigured: boolean;
  pinUpdatedAt: string | null;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Belum pernah diatur";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function PinSetupForm({ profile }: { profile: PinProfile }) {
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pinUpdatedAt, setPinUpdatedAt] = useState(profile.pinUpdatedAt);
  const [pinConfigured, setPinConfigured] = useState(profile.pinConfigured);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/auth/pin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pin }),
    });

    const json = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(json.message);
      return;
    }

    setPin("");
    setPinConfigured(true);
    setPinUpdatedAt(json.data.pinUpdatedAt);
    setMessage("PIN berhasil disimpan ke akun.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <Card variant="outlined">
        <form onSubmit={onSubmit}>
          <CardTitle>Setup PIN Alat</CardTitle>
          <CardDescription className="mt-2">
            Gunakan 4 sampai 8 digit angka. PIN ini akan diverifikasi alat lewat
            endpoint `verify_pin`.
          </CardDescription>
          <Label className="mt-6">PIN</Label>
          <Input
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            maxLength={8}
            placeholder="Contoh: 123456"
            className="mt-2"
          />
          <FormMessage variant="error">{error}</FormMessage>
          <FormMessage variant="success">{message}</FormMessage>
          <Button type="submit" loading={loading} className="mt-6 w-full">
            {loading ? "Menyimpan..." : "Simpan PIN"}
          </Button>
        </form>
      </Card>

      <Card>
        <CardTitle>Status PIN</CardTitle>
        <div className="mt-6 grid gap-4 text-sm text-slate-700">
          <p>
            <span className="font-semibold">Admin:</span> {profile.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {profile.email}
          </p>
          <p>
            <span className="font-semibold">PIN configured:</span>{" "}
            {pinConfigured ? "Ya" : "Belum"}
          </p>
          <p>
            <span className="font-semibold">Terakhir diubah:</span>{" "}
            {formatDate(pinUpdatedAt)}
          </p>
          <div className="rounded-[1.5rem] bg-slate-50 p-4 text-slate-600">
            <p className="font-semibold text-slate-900">Endpoint alat</p>
            <p className="mt-2">
              <code>POST /api/verify_pin</code>
            </p>
            <p className="mt-2 break-all">
              <code>{`{"adminId":"${profile.id}","pin":"123456"}`}</code>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
