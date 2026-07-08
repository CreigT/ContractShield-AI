"use client";

import { useRouter } from "next/navigation";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FileText, FileUp, ShieldCheck, UploadCloud } from "lucide-react";
import { FormEvent, useState } from "react";
import { AnalysisProgressStatus } from "@/components/analysis-progress";
import { AppShell } from "@/components/app-shell";
import { ShieldLogo } from "@/components/brand/shield-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contractTypes } from "@/lib/constants";
import { auth, db, storage } from "@/lib/firebase";
import type { AnalyzeContractResponse, ContractType } from "@/lib/types";

const networkTimeoutMs = 90000;

async function withTimeout<T>(promise: Promise<T>, message: string, timeoutMs = networkTimeoutMs) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ContractType>("General Business Contract");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [stage, setStage] = useState("Preparing secure upload...");

  async function extractText(selectedFile: File) {
    const formData = new FormData();
    formData.append("file", selectedFile);
    const response = await withTimeout(
      fetch("/api/extract-contract-text", {
        method: "POST",
        body: formData,
      }),
      "Text extraction is taking too long. Try a smaller file or a text-based PDF.",
      60000,
    );

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Could not extract text from this document."));
    }

    const data = (await response.json()) as { text: string };
    return data.text;
  }

  async function analyzeContract(contractText: string) {
    const response = await withTimeout(
      fetch("/api/analyze-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText, title, type, notes }),
      }),
      "AI analysis is taking too long. Please try again in a moment.",
      90000,
    );

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "AI review failed. Check your Gemini API key and try again."));
    }

    return (await response.json()) as AnalyzeContractResponse;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user || !file) return;

    setError("");
    setLoading(true);
    setStage("Uploading contract securely...");
    let contractId: string | null = null;

    try {
      const storagePath = `contracts/${user.uid}/${Date.now()}-${file.name}`;
      const fileRef = ref(storage, storagePath);
      await withTimeout(uploadBytes(fileRef, file), "File upload is taking too long. Check Firebase Storage setup and your connection.");
      const fileUrl = await withTimeout(getDownloadURL(fileRef), "Could not retrieve the uploaded file URL from Firebase Storage.");

      setStage("Saving contract record...");
      const contractDoc = await withTimeout(
        addDoc(collection(db, "contracts"), {
          userId: user.uid,
          title,
          type,
          notes,
          fileUrl,
          fileName: file.name,
          createdAt: serverTimestamp(),
          status: "reviewing",
        }),
        "Saving the contract record is taking too long. Check Firestore setup and security rules.",
      );
      contractId = contractDoc.id;

      setStage("Extracting contract text...");
      const contractText = await extractText(file);
      setStage("Analyzing contract risks...");
      const review = await analyzeContract(contractText);

      setStage("Saving AI review...");
      const reviewDoc = await withTimeout(
        addDoc(collection(db, "reviews"), {
          contractId: contractDoc.id,
          userId: user.uid,
          ...review,
          createdAt: serverTimestamp(),
        }),
        "Saving the review is taking too long. Check Firestore setup and security rules.",
      );

      setStage("Preparing results...");
      await withTimeout(
        updateDoc(doc(db, "contracts", contractDoc.id), { status: "reviewed" }),
        "Updating the contract status is taking too long. The review may still have been saved.",
      );
      router.replace(`/reviews/${reviewDoc.id}`);
    } catch (err) {
      if (contractId) {
        try {
          await withTimeout(updateDoc(doc(db, "contracts", contractId), { status: "failed" }), "Could not mark the contract review as failed.", 15000);
        } catch {
          // Preserve the original upload or analysis error for the user.
        }
      }
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
      setStage("Preparing secure upload...");
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl pb-16 sm:pb-0">
        <div className="mb-8 text-center">
          <ShieldLogo size="lg" animated={loading} scanning={loading} />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Secure Upload</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Submit a real contract for AI review.</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Upload Contract</CardTitle>
            <CardDescription>Supported file types: PDF, DOCX, and TXT.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <AnalysisProgressStatus message={stage} /> : null}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div
                className={`rounded-2xl border border-dashed p-8 text-center transition-all ${
                  isDragging ? "border-primary bg-primary/10" : "border-primary/35 bg-white/[0.025]"
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  const droppedFile = event.dataTransfer.files?.[0];
                  if (droppedFile) setFile(droppedFile);
                }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/35 bg-primary/10 text-primary">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <p className="mt-4 font-medium">{file ? file.name : "Drag and drop your contract here"}</p>
                <p className="mt-2 text-sm text-muted-foreground">Choose one real PDF, DOCX, or TXT contract to analyze.</p>
                <div className="mt-5">
                  <Label
                    htmlFor="file"
                    className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.03] px-4 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:bg-accent"
                  >
                    <FileText className="h-4 w-4" />
                    Browse files
                  </Label>
                  <Input
                    id="file"
                    className="sr-only"
                    type="file"
                    accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Contract title</Label>
                <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label>Contract type</Label>
                <Select value={type} onValueChange={(value) => setType(value as ContractType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypes.map((contractType) => (
                      <SelectItem key={contractType} value={contractType}>
                        {contractType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
              </div>

              {error ? <p className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-red-200">{error}</p> : null}

              <Button className="w-full" disabled={loading || !file}>
                {loading ? <ShieldCheck className="h-4 w-4" /> : <FileUp className="h-4 w-4" />}
                {loading ? "Reviewing contract..." : "Submit for AI Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
