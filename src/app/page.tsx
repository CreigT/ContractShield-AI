"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, BrainCircuit, CircleHelp, FileText, Flag, Gauge, LockKeyhole, ShieldCheck, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandMark, ShieldLogo } from "@/components/brand/shield-logo";
import { FadeIn } from "@/components/motion/fade-in";
import { legalDisclaimer } from "@/lib/constants";

const features = [
  { title: "Plain-English Summaries", description: "Translate complex clauses into clear business language.", icon: FileText },
  { title: "Risk Score", description: "Classify contract risk only after a real document is analyzed.", icon: Gauge },
  { title: "Red Flag Detection", description: "Surface concerning obligations, notice terms, and liability language.", icon: Flag },
  { title: "Renewal Tracking", description: "Deadline monitoring for future release.", icon: ShieldCheck, comingSoon: true },
  { title: "PDF Reports", description: "Polished export workflow for future release.", icon: FileText, comingSoon: true },
  { title: "Recommended Questions", description: "Generate practical questions to ask before signing.", icon: CircleHelp },
];

const trustBadges = [
  { title: "Enterprise Security", icon: LockKeyhole },
  { title: "Private Document Storage", icon: ShieldCheck },
  { title: "AI-Powered Analysis", icon: BrainCircuit },
];

export default function LandingPage() {
  return (
    <main className="enterprise-bg min-h-screen overflow-hidden">
      <header className="border-b border-white/10 bg-[#0B0B0D]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" aria-label="ContractShield AI home">
            <BrandMark />
          </Link>
          <Button asChild>
            <Link href="/login">
              <Upload className="h-4 w-4" />
              Upload Contract
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <FadeIn className="order-2 flex justify-center lg:order-1">
          <div className="relative flex aspect-square w-full max-w-[420px] items-center justify-center">
            <div className="absolute inset-8 rounded-full border border-primary/10 bg-primary/[0.03] blur-2xl" />
            <div className="absolute inset-0 rounded-full border border-white/5" />
            <ShieldLogo size="xl" animated scanning />
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="order-1 space-y-8 lg:order-2">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Creignificent LLC</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-foreground sm:text-7xl">
              Review Smarter.
              <br />
              Sign with Confidence.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              AI-powered contract intelligence that helps businesses understand agreements before they sign.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/login">
                <Upload className="h-4 w-4" />
                Upload Contract
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </FadeIn>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <FadeIn className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Contract Intelligence</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">Built for business decisions that need confidence.</h2>
        </FadeIn>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <motion.div key={feature.title} whileHover={feature.comingSoon ? undefined : { y: -4 }} transition={{ duration: 0.2 }}>
              <Card className={feature.comingSoon ? "opacity-55" : ""}>
                <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                  </div>
                  {feature.comingSoon ? <Badge variant="outline">Coming Soon</Badge> : null}
              </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2 text-base">{feature.title}</CardTitle>
                  <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {trustBadges.map((badge) => (
            <Card key={badge.title} className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                  <badge.icon className="h-5 w-5" />
                </span>
                <p className="font-medium">{badge.title}</p>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>{legalDisclaimer}</p>
        </div>
      </section>
    </main>
  );
}
