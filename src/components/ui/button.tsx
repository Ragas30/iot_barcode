import type { ButtonHTMLAttributes, ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Button – reusable button with variants                            */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "outline" | "ghost" | "destructive";
type ButtonSize = "default" | "sm" | "pill";

const base =
  "inline-flex items-center justify-center font-medium transition disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-950 text-white hover:bg-slate-800 disabled:bg-slate-400 disabled:opacity-100",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:border-slate-950 hover:text-slate-950",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:opacity-100",
};

const sizes: Record<ButtonSize, string> = {
  default: "rounded-2xl px-4 py-3 text-sm",
  sm: "rounded-xl px-3 py-2 text-xs",
  pill: "rounded-full px-4 py-2 text-sm",
};

export function Button({
  variant = "primary",
  size = "default",
  loading = false,
  className = "",
  children,
  ...props
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
