import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Card – reusable panel / section container                         */
/* ------------------------------------------------------------------ */

type CardVariant = "default" | "outlined" | "dashed" | "glass";

const variantStyles: Record<CardVariant, string> = {
  default:
    "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]",
  outlined:
    "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]",
  dashed:
    "rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-6",
  glass:
    "rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur",
};

export function Card({
  variant = "default",
  className = "",
  children,
}: {
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${variantStyles[variant]} ${className}`}>{children}</div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card sub-components                                               */
/* ------------------------------------------------------------------ */

export function CardHeader({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
}

export function CardTitle({
  as: Tag = "h3",
  className = "",
  children,
}: {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: ReactNode;
}) {
  const sizeMap = {
    h1: "text-3xl",
    h2: "text-xl",
    h3: "text-lg",
  };

  return (
    <Tag
      className={`${sizeMap[Tag]} font-semibold tracking-tight text-slate-950 ${className}`}
    >
      {children}
    </Tag>
  );
}

export function CardDescription({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={`text-sm leading-7 text-slate-600 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={className}>{children}</div>;
}
