import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  EmptyState – placeholder for empty / no-result areas              */
/* ------------------------------------------------------------------ */

type EmptyVariant = "dashed" | "gradient";

const variantStyles: Record<EmptyVariant, string> = {
  dashed:
    "rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500",
  gradient:
    "flex h-full min-h-80 items-center justify-center rounded-[1.5rem] bg-[radial-gradient(circle_at_top,#e2e8f0,transparent_60%)] text-center text-sm leading-7 text-slate-500",
};

export function EmptyState({
  variant = "dashed",
  className = "",
  children,
}: {
  variant?: EmptyVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${variantStyles[variant]} ${className}`}>{children}</div>
  );
}
