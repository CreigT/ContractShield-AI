"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Download, FileText, HelpCircle, Scale, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ShieldLogo } from "@/components/brand/shield-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import type { ContractRecord, KeyTerms, ReviewRecord, RiskLevel } from "@/lib/types";

const keyTermLabels: Record<keyof KeyTerms, string> = {
  parties: "Parties",
  effectiveDate: "Effective date",
  expirationDate: "Expiration date",
  autoRenewal: "Auto-renewal",
  paymentTerms: "Payment terms",
  terminationNotice: "Termination notice",
  insuranceRequirements: "Insurance requirements",
  liability: "Liability",
  indemnification: "Indemnification",
  governingLaw: "Governing law",
};

function riskVariant(level: RiskLevel) {
  if (level === "High") return "destructive";
  if (level === "Medium") return "secondary";
  return "default";
}

function riskTone(level: RiskLevel) {
  if (level === "High") return "border-red-400/30 bg-red-400/10 text-red-200";
  if (level === "Medium") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
}

function formatDate(value: ContractRecord["createdAt"] | ReviewRecord["createdAt"] | undefined) {
  return value?.toDate ? value.toDate().toLocaleDateString() : "Pending";
}

export default function ReviewResultsPage() {
  const params = useParams<{ id: string }>();
  const [review, setReview] = useState<ReviewRecord | null>(null);
  const [contract, setContract] = useState<ContractRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setReview(null);
        setContract(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const reviewSnap = await getDoc(doc(db, "reviews", params.id));
        if (!reviewSnap.exists()) {
          setLoading(false);
          return;
        }

        const reviewData = { id: reviewSnap.id, ...reviewSnap.data() } as ReviewRecord;
        if (reviewData.userId !== user.uid) {
          setLoading(false);
          return;
        }

        const contractSnap = await getDoc(doc(db, "contracts", reviewData.contractId));
        const contractData = contractSnap.exists() ? ({ id: contractSnap.id, ...contractSnap.data() } as ContractRecord) : null;
        setReview(reviewData);
        setContract(contractData);
        setLoading(false);
      } catch {
        setReview(null);
        setContract(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [params.id]);

  function downloadReport() {
    if (!review || !contract) return;

    const lines = [
      "ContractShield AI Review Report",
      "",
      `Contract title: ${contract.title}`,
      `Upload date: ${formatDate(contract.createdAt)}`,
      `Overall risk score: ${review.riskLevel}`,
      "",
      "Plain-English summary",
      review.summary,
      "",
      "Key terms",
      ...Object.entries(keyTermLabels).map(([key, label]) => `${label}: ${review.keyTerms[key as keyof KeyTerms] || "Not found"}`),
      "",
      "Red flags",
      ...(review.redFlags.length ? review.redFlags.map((item) => `- ${item}`) : ["None identified."]),
      "",
      "Recommended questions to ask",
      ...(review.recommendations.length ? review.recommendations.map((item) => `- ${item}`) : ["None provided."]),
      "",
      "Legal disclaimer",
      "ContractShield AI provides informational assistance only and does not provide legal advice. Consult a qualified attorney before signing legal agreements.",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${contract.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-review.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      {loading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <ShieldLogo size="lg" animated scanning />
        </div>
      ) : !review || !contract ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="font-medium">Review not found.</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 pb-16 sm:pb-0">
          <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">{contract.title}</h1>
              <p className="text-sm text-muted-foreground">Uploaded {formatDate(contract.createdAt)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={riskVariant(review.riskLevel)}>Overall risk score: {review.riskLevel}</Badge>
              <Button variant="outline" onClick={downloadReport}>
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader className="flex-row items-center gap-3 space-y-0">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </span>
                    <CardTitle>Plain-English Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="leading-7 text-muted-foreground">{review.summary}</CardContent>
                </Card>
              </motion.div>

              <Card>
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                    <Scale className="h-5 w-5" />
                  </span>
                  <CardTitle>Key Clauses</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {Object.entries(keyTermLabels).map(([key, label]) => (
                    <div key={key} className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{review.keyTerms[key as keyof KeyTerms] || "Not found"}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <CardTitle>Contract Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-sm font-medium">Contract type</p>
                    <p className="mt-2 text-sm text-muted-foreground">{contract.type}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-sm font-medium">File name</p>
                    <p className="mt-2 break-words text-sm text-muted-foreground">{contract.fileName}</p>
                  </div>
                  {contract.notes ? (
                    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:col-span-2">
                      <p className="text-sm font-medium">Notes</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{contract.notes}</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <ShieldLogo size="lg" animated={review.riskLevel === "High"} scanning={review.riskLevel === "High"} />
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Risk Shield</p>
                  <div className={`mx-auto mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${riskTone(review.riskLevel)}`}>
                    Risk Level: {review.riskLevel}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {review.recommendations.length ? (
                    <div className="space-y-3">
                      {review.recommendations.map((question) => (
                        <div key={question} className="rounded-xl border border-primary/20 bg-primary/[0.045] p-4 text-sm leading-6 text-muted-foreground">
                          {question}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No additional questions were recommended.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                  Red Flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                {review.redFlags.length ? (
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {review.redFlags.map((flag) => (
                      <li key={flag}>{flag}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No red flags were identified.</p>
                )}
              </CardContent>
            </Card>
            </aside>
          </div>

          <Separator />
          <p className="text-xs text-muted-foreground">
            ContractShield AI provides informational assistance only and does not provide legal advice. Consult a qualified attorney before signing legal agreements.
          </p>
        </div>
      )}
    </AppShell>
  );
}
