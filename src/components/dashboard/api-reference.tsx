"use client";

import { useState } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  API Endpoint Data                                                 */
/* ------------------------------------------------------------------ */

type ApiEndpoint = {
  method: "GET" | "POST";
  path: string;
  title: string;
  description: string;
  auth: "JWT Cookie" | "Public";
  rateLimit: string;
  request?: {
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
    query?: Record<string, string>;
  };
  responses: {
    status: number;
    label: string;
    body: Record<string, unknown>;
  }[];
};

const endpoints: ApiEndpoint[] = [
  {
    method: "POST",
    path: "/api/auth/login",
    title: "Login",
    description: "Autentikasi admin. Mengembalikan data admin dan set JWT di HttpOnly cookie.",
    auth: "Public",
    rateLimit: "5 req / menit",
    request: {
      headers: { "Content-Type": "application/json" },
      body: { email: "admin@example.com", password: "admin123" },
    },
    responses: [
      {
        status: 200,
        label: "Success",
        body: {
          success: true,
          message: "Login berhasil.",
          data: {
            id: "abc123",
            email: "admin@example.com",
            name: "Admin",
            pinConfigured: true,
            pinUpdatedAt: "2026-07-03T10:00:00.000Z",
          },
        },
      },
      {
        status: 401,
        label: "Auth Error",
        body: {
          success: false,
          message: "Email atau password salah.",
          error: { code: "AUTHENTICATION_ERROR" },
        },
      },
    ],
  },
  {
    method: "POST",
    path: "/api/auth/logout",
    title: "Logout",
    description: "Hapus JWT cookie dan akhiri sesi admin.",
    auth: "JWT Cookie",
    rateLimit: "20 req / menit",
    responses: [
      {
        status: 200,
        label: "Success",
        body: {
          success: true,
          message: "Logout berhasil.",
          data: {},
        },
      },
    ],
  },
  {
    method: "POST",
    path: "/api/auth/pin",
    title: "Setup PIN",
    description: "Simpan/update PIN perangkat untuk akun admin yang sedang login.",
    auth: "JWT Cookie",
    rateLimit: "10 req / menit",
    request: {
      headers: { "Content-Type": "application/json" },
      body: { pin: "123456" },
    },
    responses: [
      {
        status: 200,
        label: "Success",
        body: {
          success: true,
          message: "PIN berhasil disimpan.",
          data: {
            id: "abc123",
            email: "admin@example.com",
            name: "Admin",
            pinConfigured: true,
            pinUpdatedAt: "2026-07-03T10:00:00.000Z",
          },
        },
      },
      {
        status: 422,
        label: "Validation Error",
        body: {
          success: false,
          message: "PIN harus 4-8 digit angka.",
          error: { code: "VALIDATION_ERROR" },
        },
      },
    ],
  },
  {
    method: "POST",
    path: "/api/qr",
    title: "Generate QR",
    description: "Buat QR code baru dengan token unik. Tidak perlu body, cukup kirim POST request. Token aktif selama 1 menit.",
    auth: "JWT Cookie",
    rateLimit: "15 req / menit",
    request: {
      headers: { "Content-Type": "application/json" },
      body: {},
    },
    responses: [
      {
        status: 201,
        label: "Created",
        body: {
          success: true,
          message: "QR berhasil dibuat.",
          data: {
            id: "tok_abc123",
            adminId: "abc123",
            name: "QR Token",
            token: "a1b2c3d4e5f6...",
            type: "qr",
            status: "active",
            createdAt: "2026-07-03T10:00:00.000Z",
            expiredAt: "2026-07-03T10:01:00.000Z",
            image: "data:image/png;base64,...",
            payload: "a1b2c3d4e5f6...",
            verifyEndpoint: "http://localhost:3000/api/verify_qr",
          },
        },
      },
    ],
  },
  {
    method: "GET",
    path: "/api/qr",
    title: "List QR Tokens",
    description: "Ambil semua QR token milik admin yang sedang login.",
    auth: "JWT Cookie",
    rateLimit: "60 req / menit",
    responses: [
      {
        status: 200,
        label: "Success",
        body: {
          success: true,
          message: "Daftar QR berhasil diambil.",
          data: [
            {
              id: "tok_abc123",
              adminId: "abc123",
              name: "Pintu Gudang A",
              token: "a1b2c3d4e5f6...",
              type: "qr",
              status: "active",
              createdAt: "2026-07-03T10:00:00.000Z",
              expiredAt: "2026-07-03T10:01:00.000Z",
            },
          ],
        },
      },
    ],
  },
  {
    method: "GET",
    path: "/api/validate?token={token}",
    title: "Validate Token",
    description: "Validasi token QR. Dipakai IoT device untuk cek apakah token masih aktif.",
    auth: "Public",
    rateLimit: "120 req / menit",
    request: {
      query: { token: "a1b2c3d4e5f6..." },
    },
    responses: [
      {
        status: 200,
        label: "Valid",
        body: {
          success: true,
          message: "Token valid.",
          data: {
            id: "tok_abc123",
            adminId: "abc123",
            name: "Pintu Gudang A",
            token: "a1b2c3d4e5f6...",
            type: "qr",
            status: "active",
            createdAt: "2026-07-03T10:00:00.000Z",
            expiredAt: "2026-07-03T10:01:00.000Z",
          },
        },
      },
      {
        status: 404,
        label: "Not Found",
        body: {
          success: false,
          message: "Token tidak ditemukan.",
          error: { code: "NOT_FOUND" },
        },
      },
      {
        status: 410,
        label: "Expired",
        body: {
          success: false,
          message: "Token sudah expired.",
          error: { code: "EXPIRED" },
        },
      },
    ],
  },
  {
    method: "POST",
    path: "/api/verify_qr",
    title: "Verify QR",
    description: "Verifikasi spesifik QR token. Endpoint ini dipanggil oleh IoT device setelah scan.",
    auth: "Public",
    rateLimit: "120 req / menit",
    request: {
      headers: { "Content-Type": "application/json" },
      body: { token: "a1b2c3d4e5f6..." },
    },
    responses: [
      {
        status: 200,
        label: "Valid",
        body: {
          success: true,
          message: "QR valid.",
          data: {
            valid: true,
            token: "a1b2c3d4e5f6...",
            adminId: "abc123",
            name: "Pintu Gudang A",
            expiredAt: "2026-07-03T10:01:00.000Z",
          },
        },
      },
      {
        status: 404,
        label: "Not Found",
        body: {
          success: false,
          message: "Kode QR tidak ditemukan.",
          error: { code: "NOT_FOUND" },
        },
      },
      {
        status: 410,
        label: "Expired",
        body: {
          success: false,
          message: "Token sudah expired.",
          error: { code: "EXPIRED" },
        },
      },
    ],
  },
  {
    method: "POST",
    path: "/api/verify_pin",
    title: "Verify PIN",
    description: "Verifikasi PIN perangkat. Dipakai IoT device sebelum memulai sesi scan QR.",
    auth: "Public",
    rateLimit: "120 req / menit",
    request: {
      headers: { "Content-Type": "application/json" },
      body: { adminId: "abc123", pin: "123456" },
    },
    responses: [
      {
        status: 200,
        label: "Valid",
        body: {
          success: true,
          message: "PIN valid.",
          data: {
            valid: true,
            adminId: "abc123",
            name: "Admin",
          },
        },
      },
      {
        status: 401,
        label: "Invalid PIN",
        body: {
          success: false,
          message: "Incorrect pin",
          error: { code: "AUTHENTICATION_ERROR" },
        },
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Method badge color                                                */
/* ------------------------------------------------------------------ */

function MethodBadge({ method }: { method: "GET" | "POST" }) {
  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
        method === "GET"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {method}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Single API Card                                                   */
/* ------------------------------------------------------------------ */

function ApiCard({ endpoint }: { endpoint: ApiEndpoint }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-3">
        <MethodBadge method={endpoint.method} />
        <div className="min-w-0 flex-1">
          <CardTitle>{endpoint.title}</CardTitle>
          <code className="mt-1 block text-xs text-slate-500 break-all">
            {endpoint.path}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={endpoint.auth === "Public" ? "neutral" : "success"}
          >
            {endpoint.auth}
          </Badge>
        </div>
      </div>

      <CardDescription className="mt-3">
        {endpoint.description}
      </CardDescription>

      <p className="mt-2 text-xs text-slate-400">
        Rate limit: {endpoint.rateLimit}
      </p>

      {/* Request */}
      {endpoint.request && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Request
          </p>
          {endpoint.request.query && (
            <div className="mb-2">
              <p className="mb-1 text-[11px] font-semibold text-slate-500">
                Query Params
              </p>
              <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-emerald-400">
                {Object.entries(endpoint.request.query)
                  .map(([k, v]) => `?${k}=${v}`)
                  .join("\n")}
              </pre>
            </div>
          )}
          {endpoint.request.body && (
            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-emerald-400">
              {JSON.stringify(endpoint.request.body, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Response Tabs */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          Response
        </p>
        <div className="flex flex-wrap gap-1.5">
          {endpoint.responses.map((res, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${
                activeTab === idx
                  ? "bg-slate-950 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span
                className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                  res.status < 300
                    ? "bg-emerald-500"
                    : res.status < 500
                      ? "bg-amber-500"
                      : "bg-rose-500"
                }`}
              />
              {res.status} {res.label}
            </button>
          ))}
        </div>
        <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-sky-300">
          {JSON.stringify(endpoint.responses[activeTab].body, null, 2)}
        </pre>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Export: Full API Reference List                                    */
/* ------------------------------------------------------------------ */

export function ApiReference() {
  return (
    <div className="space-y-4">
      {endpoints.map((ep, idx) => (
        <ApiCard key={idx} endpoint={ep} />
      ))}
    </div>
  );
}
