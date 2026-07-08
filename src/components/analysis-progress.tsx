"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ProcessingShield } from "@/components/brand/shield-logo";

const messages = [
  "Scanning contract...",
  "Extracting clauses...",
  "Identifying risks...",
  "Generating summary...",
  "Preparing recommendations...",
];

export function AnalysisProgress() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 1400);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-6 text-center">
      <ProcessingShield label={messages[index]} />
      <div className="mx-auto mt-5 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ x: ["-100%", "120%"] }}
          transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

export function AnalysisProgressStatus({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-6 text-center">
      <ProcessingShield label={message} />
      <div className="mx-auto mt-5 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ x: ["-100%", "120%"] }}
          transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
