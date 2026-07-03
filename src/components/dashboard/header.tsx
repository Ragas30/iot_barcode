import { LogoutButton } from "@/src/components/dashboard/logout-button";

/* ------------------------------------------------------------------ */
/*  DashboardHeader – top bar for the main content area               */
/* ------------------------------------------------------------------ */

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
          Control Panel
        </p>
        <h1 className="mt-1 text-xl font-semibold text-slate-950">
          IoT Dashboard
        </h1>
      </div>
      <LogoutButton />
    </header>
  );
}
