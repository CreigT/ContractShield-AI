"use client";

import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { FilePlus2, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import type { ContractRecord, ReviewRecord, RiskLevel } from "@/lib/types";
import { ShieldMetricIcon } from "@/components/brand/shield-logo";
import { FadeIn } from "@/components/motion/fade-in";

function riskVariant(level: RiskLevel) {
  if (level === "High") return "destructive";
  if (level === "Medium") return "secondary";
  return "default";
}

function statusLabel(status: ContractRecord["status"]) {
  if (status === "reviewing") return "Review in progress";
  if (status === "failed") return "Review failed";
  if (status === "uploaded") return "Uploaded";
  return "Reviewed";
}

function createdAtMillis(record: ContractRecord | ReviewRecord) {
  return record.createdAt?.toDate ? record.createdAt.toDate().getTime() : 0;
}

export default function DashboardPage() {
  const [contracts, setContracts] = useState<ContractRecord[]>([]);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    let unsubscribeContracts: (() => void) | undefined;
    let unsubscribeReviews: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeContracts?.();
      unsubscribeReviews?.();

      if (!user) {
        setContracts([]);
        setReviews([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const contractsQuery = query(collection(db, "contracts"), where("userId", "==", user.uid));
      const reviewsQuery = query(collection(db, "reviews"), where("userId", "==", user.uid));

      unsubscribeContracts = onSnapshot(
        contractsQuery,
        (snapshot) => {
          setContracts(
            snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }) as ContractRecord)
              .sort((a, b) => createdAtMillis(b) - createdAtMillis(a)),
          );
          setLoading(false);
        },
        () => {
          setContracts([]);
          setLoading(false);
        },
      );

      unsubscribeReviews = onSnapshot(
        reviewsQuery,
        (snapshot) => {
          setReviews(
            snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }) as ReviewRecord)
              .sort((a, b) => createdAtMillis(b) - createdAtMillis(a)),
          );
        },
        () => {
          setReviews([]);
        },
      );
    });

    return () => {
      unsubscribeAuth();
      unsubscribeContracts?.();
      unsubscribeReviews?.();
    };
  }, []);

  const counts = useMemo(
    () => ({
      Low: reviews.filter((review) => review.riskLevel === "Low").length,
      Medium: reviews.filter((review) => review.riskLevel === "Medium").length,
      High: reviews.filter((review) => review.riskLevel === "High").length,
    }),
    [reviews],
  );

  const reviewByContract = new Map(reviews.map((review) => [review.contractId, review]));

  return (
    <AppShell>
      <div className="space-y-8 pb-16 sm:pb-0">
        <FadeIn className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Command Center</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Welcome back.</h1>
            <p className="mt-2 text-sm text-muted-foreground">Review activity and risk levels are calculated only from your completed contract analyses.</p>
          </div>
          <Button asChild>
            <Link href="/upload">
              <FilePlus2 className="h-4 w-4" />
              Upload Contract
            </Link>
          </Button>
        </FadeIn>

        <section className="grid gap-4 md:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base">Low risk</CardTitle>
              <ShieldMetricIcon tone="green" />
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{counts.Low}</CardContent>
          </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base">Medium risk</CardTitle>
              <ShieldMetricIcon tone="amber" />
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{counts.Medium}</CardContent>
          </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base">High risk</CardTitle>
              <ShieldMetricIcon tone="red" />
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{counts.High}</CardContent>
          </Card>
          </motion.div>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Recent contract reviews</CardTitle>
              <CardDescription>Only contracts tied to your account are shown.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading contracts...</p>
              ) : contracts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-primary/35 bg-primary/[0.03] p-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/35 bg-primary/10 text-primary">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="mt-4 font-medium">No contracts have been reviewed yet.</p>
                  <p className="mt-2 text-sm text-muted-foreground">Upload your first contract to begin AI analysis.</p>
                  <Button className="mt-5" asChild>
                    <Link href="/upload">Upload Contract</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {contracts.map((contract) => {
                    const review = reviewByContract.get(contract.id);
                    const rowContent = (
                      <>
                        <div>
                          <p className="font-medium">{contract.title}</p>
                          <p className="text-sm text-muted-foreground">{contract.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {review ? <Badge variant={riskVariant(review.riskLevel)}>{review.riskLevel}</Badge> : <Badge variant="outline">{statusLabel(contract.status)}</Badge>}
                        </div>
                      </>
                    );

                    if (review) {
                      return (
                        <Link key={contract.id} href={`/reviews/${review.id}`} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                          {rowContent}
                        </Link>
                      );
                    }

                    return (
                      <div key={contract.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        {rowContent}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
