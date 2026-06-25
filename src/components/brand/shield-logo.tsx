"use client";

import { motion } from "framer-motion";
import { Check, FileText, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type ShieldLogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  scanning?: boolean;
  className?: string;
};

const sizes = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-28 w-28",
  xl: "h-56 w-56 sm:h-72 sm:w-72",
};

export function ShieldLogo({ size = "md", animated = false, scanning = false, className }: ShieldLogoProps) {
  const Wrapper = animated ? motion.div : "div";

  return (
    <Wrapper
      className={cn("relative inline-flex items-center justify-center shield-glow", sizes[size], className)}
      {...(animated
        ? {
            animate: { scale: [1, 1.025, 1] },
            transition: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
          }
        : {})}
    >
      <svg viewBox="0 0 220 250" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="shieldGold" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#F7E7A3" />
            <stop offset="45%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8B6F1E" />
          </linearGradient>
          <linearGradient id="shieldPanel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#20242D" />
            <stop offset="100%" stopColor="#0B0B0D" />
          </linearGradient>
        </defs>
        <path
          d="M110 10 198 43v72c0 58-35 101-88 125-53-24-88-67-88-125V43L110 10Z"
          fill="url(#shieldPanel)"
          stroke="url(#shieldGold)"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <path d="M75 71h70l17 17v85H75V71Z" fill="#11141B" stroke="#D4AF37" strokeWidth="6" strokeLinejoin="round" />
        <path d="M145 72v20h20" fill="none" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M93 115h49M93 138h38" stroke="#F7E7A3" strokeWidth="7" strokeLinecap="round" />
        <path d="m91 166 17 17 38-45" fill="none" stroke="#34D399" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {scanning ? (
        <span className="pointer-events-none absolute inset-x-5 top-1/2 h-12 rounded-full bg-gradient-to-b from-transparent via-primary/45 to-transparent blur-sm scan-line" />
      ) : null}
    </Wrapper>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/35 bg-primary/10">
        <ShieldCheck className="h-5 w-5 text-primary" />
      </span>
      <span className="font-semibold tracking-normal text-foreground">ContractShield AI</span>
    </span>
  );
}

export function ProcessingShield({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <ShieldLogo size="lg" animated scanning />
      {label ? <p className="text-sm font-medium text-primary">{label}</p> : null}
    </div>
  );
}

export function ShieldMetricIcon({ tone = "gold" }: { tone?: "gold" | "green" | "amber" | "red" | "navy" }) {
  const toneClass = {
    gold: "border-primary/35 bg-primary/10 text-primary",
    green: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    red: "border-red-400/30 bg-red-400/10 text-red-300",
    navy: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  }[tone];

  return (
    <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl border", toneClass)}>
      <ShieldCheck className="h-5 w-5" />
    </span>
  );
}

export function DocumentCheckIcon() {
  return (
    <span className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
      <FileText className="h-5 w-5 text-primary" />
      <Check className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 p-0.5 text-black" />
    </span>
  );
}
