"use client";

import { useState } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input, Label, FormMessage } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { EmptyState } from "@/src/components/ui/empty-state";

type AdminSummary = {
  id: string;
  name: string;
  email: string;
  pinConfigured: boolean;
  createdAt: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

const emptyForm = { name: "", email: "", password: "" };

export function UserManagement({
  users: initialUsers,
  currentAdminId,
}: {
  users: AdminSummary[];
  currentAdminId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function resetFeedback() {
    setMessage("");
    setError("");
  }

  function setField(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEdit(user: AdminSummary) {
    resetFeedback();
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    resetFeedback();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    resetFeedback();

    const payload: Record<string, string> = {};

    if (editingId) {
      if (form.name !== "") payload.name = form.name;
      if (form.email !== "") payload.email = form.email;
      if (form.password !== "") payload.password = form.password;
    } else {
      payload.name = form.name;
      payload.email = form.email;
      payload.password = form.password;
    }

    try {
      const response = await fetch(
        editingId ? `/api/admin/${editingId}` : "/api/admin",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        setError(json.message);
        return;
      }

      setUsers((prev) => {
        if (editingId) {
          return prev.map((user) => (user.id === editingId ? json.data : user));
        }
        return [json.data, ...prev];
      });

      setForm(emptyForm);
      setEditingId(null);
      setMessage(
        editingId ? "User berhasil diperbarui." : "User berhasil ditambahkan.",
      );
    } catch {
      setError("Terjadi kesalahan saat menyimpan user.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onResetPin(user: AdminSummary) {
    const confirmed = window.confirm(
      `Hapus PIN user "${user.name}"? User harus mengatur PIN baru lewat menu Setup PIN.`,
    );

    if (!confirmed) {
      return;
    }

    setSubmitting(true);
    resetFeedback();

    try {
      const response = await fetch(`/api/admin/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetPin: true }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.message);
        return;
      }

      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? json.data : item)),
      );
      setMessage(`PIN user "${user.name}" berhasil direset.`);
    } catch {
      setError("Terjadi kesalahan saat mereset PIN.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Hapus user "${name}"? Semua token QR miliknya juga akan dihapus.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    resetFeedback();

    try {
      const response = await fetch(`/api/admin/${id}`, {
        method: "DELETE",
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.message);
        return;
      }

      if (editingId === id) {
        cancelEdit();
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
      setMessage("User berhasil dihapus.");
    } catch {
      setError("Terjadi kesalahan saat menghapus user.");
    } finally {
      setDeletingId(null);
    }
  }

  const editingUser = editingId
    ? users.find((user) => user.id === editingId)
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
      <Card variant="outlined">
        <form onSubmit={onSubmit}>
          <CardTitle>{editingId ? "Edit User" : "Tambah User"}</CardTitle>
          <CardDescription className="mt-2">
            {editingId
              ? `Mengubah akun "${editingUser?.name ?? ""}".`
              : "Buat akun login baru. Password disimpan terenkripsi dengan bcrypt."}
          </CardDescription>

          <Label className="mt-6">Nama</Label>
          <Input
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            placeholder="Contoh: Budi Santoso"
            className="mt-2"
            required
          />

          <Label className="mt-4">Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            placeholder="Contoh: budi@example.com"
            className="mt-2"
            required
          />

          <Label className="mt-4">Password</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(event) => setField("password", event.target.value)}
            placeholder={
              editingId
                ? "Kosongkan jika tidak diubah"
                : "Minimal 6 karakter"
            }
            minLength={editingId ? undefined : 6}
            className="mt-2"
            required={!editingId}
          />

          {editingId && editingUser?.pinConfigured && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={submitting}
              onClick={() => onResetPin(editingUser)}
              className="mt-4 text-rose-600 hover:bg-rose-50 hover:text-rose-600"
            >
              Reset PIN user ini
            </Button>
          )}

          <FormMessage variant="error">{error}</FormMessage>
          <FormMessage variant="success">{message}</FormMessage>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                disabled={submitting}
              >
                Batal
              </Button>
            )}
            <Button
              type="submit"
              loading={submitting}
              className={editingId ? "" : "col-span-2"}
            >
              {submitting
                ? "Menyimpan..."
                : editingId
                  ? "Simpan Perubahan"
                  : "Tambah User"}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Daftar User</CardTitle>
            <CardDescription className="mt-1">
              Semua akun yang bisa login ke dashboard.
            </CardDescription>
          </div>
          <Badge variant="neutral" className="tracking-[0.24em]">
            {users.length} users
          </Badge>
        </div>

        {users.length === 0 ? (
          <EmptyState className="mt-6">Belum ada user.</EmptyState>
        ) : (
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
            <div className="grid grid-cols-[1.4fr_1.2fr_0.7fr_0.7fr_0.9fr] gap-4 bg-slate-950 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              <span>Nama</span>
              <span>Email</span>
              <span>PIN</span>
              <span>Dibuat</span>
              <span className="text-right">Aksi</span>
            </div>
            <div className="divide-y divide-slate-200">
              {users.map((user) => {
                const isCurrent = user.id === currentAdminId;
                const isEditing = user.id === editingId;
                return (
                  <div
                    key={user.id}
                    className={`grid grid-cols-[1.4fr_1.2fr_0.7fr_0.7fr_0.9fr] items-center gap-4 px-4 py-4 text-sm text-slate-700 ${
                      isEditing ? "bg-amber-50/60" : ""
                    }`}
                  >
                    <p className="font-semibold text-slate-950">
                      {user.name}
                      {isCurrent && (
                        <span className="ml-2 text-xs font-medium text-amber-600">
                          (Anda)
                        </span>
                      )}
                    </p>
                    <span className="truncate">{user.email}</span>
                    <span>
                      <Badge
                        variant={user.pinConfigured ? "success" : "neutral"}
                      >
                        {user.pinConfigured ? "Ada" : "Belum"}
                      </Badge>
                    </span>
                    <span>{formatDate(user.createdAt)}</span>
                    <span className="flex justify-end gap-2">
                      <Button
                        variant={isEditing ? "ghost" : "outline"}
                        size="sm"
                        disabled={submitting || deletingId !== null}
                        onClick={() =>
                          isEditing ? cancelEdit() : startEdit(user)
                        }
                        className={
                          isEditing
                            ? "text-slate-400"
                            : "hover:border-slate-950 hover:text-slate-950"
                        }
                      >
                        {isEditing ? "Batal" : "Edit"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        loading={deletingId === user.id}
                        disabled={isCurrent}
                        onClick={() => onDelete(user.id, user.name)}
                        className="text-rose-600 hover:border-rose-600 hover:text-rose-600"
                      >
                        Hapus
                      </Button>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
