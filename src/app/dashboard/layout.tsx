import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/src/components/dashboard/header";
import { Sidebar } from "@/src/components/dashboard/sidebar";
import { requireAuth } from "@/src/middleware/auth";
import { Card } from "@/src/components/ui/card";

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
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <Card variant="outlined" className="min-w-0">
          <DashboardHeader />
          <div className="mt-6">{children}</div>
        </Card>
      </div>
    </main>
  );
}
