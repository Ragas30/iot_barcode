import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Badge – status pill / indicator                                   */
/* ------------------------------------------------------------------ */

type BadgeVariant = "success" | "destructive" | "neutral";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-100 text-emerald-700",
  destructive: "bg-rose-100 text-rose-700",
  neutral: "bg-slate-100 text-slate-600",
};

export function Badge({
  variant = "neutral",
  className = "",
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
