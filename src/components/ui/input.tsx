import type { InputHTMLAttributes } from "react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Input – standardised form field                                   */
/* ------------------------------------------------------------------ */

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 transition focus:border-slate-950 ${className}`}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Label – form label                                                */
/* ------------------------------------------------------------------ */

export function Label({
  className = "",
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
} & React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`block text-sm font-medium text-slate-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  FormMessage – error / success feedback                            */
/* ------------------------------------------------------------------ */

export function FormMessage({
  variant = "error",
  children,
}: {
  variant?: "error" | "success";
  children: ReactNode;
}) {
  if (!children) return null;

  const color = variant === "error" ? "text-rose-600" : "text-emerald-700";

  return <p className={`mt-3 text-sm ${color}`}>{children}</p>;
}
