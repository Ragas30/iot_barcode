import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/src/components/dashboard/logout-button";
import { Sidebar } from "@/src/components/dashboard/sidebar";
import { requireAuth } from "@/src/middleware/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    await requireAuth();
  } catch {
    redirect("/login");
  }

  return (
    <main className="min-h-screen px-6 py-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <div className="rounded-[2rem] border border-white/60 bg-[var(--color-panel)] p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="mb-6 flex items-center justify-end">
            <LogoutButton />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
