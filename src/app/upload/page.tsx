"use client";

import { useRouter } from "next/navigation";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FileText, FileUp, ShieldCheck, UploadCloud } from "lucide-react";
import { FormEvent, useState } from "react";
import { AnalysisProgress } from "@/components/analysis-progress";
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

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ContractType>("General Business Contract");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  async function extractText(selectedFile: File) {
    const formData = new FormData();
    formData.append("file", selectedFile);
    const response = await fetch("/api/extract-contract-text", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Could not extract text from this document.");
    }

    const data = (await response.json()) as { text: string };
    return data.text;
  }

  async function analyzeContract(contractText: string) {
    const response = await fetch("/api/analyze-contract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contractText, title, type, notes }),
    });

    if (!response.ok) {
      throw new Error("AI review failed. Check your Gemini API key and try again.");
    }

    return (await response.json()) as AnalyzeContractResponse;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user || !file) return;

    setError("");
    setLoading(true);
    let contractId: string | null = null;

    try {
      const storagePath = `contracts/${user.uid}/${Date.now()}-${file.name}`;
      const fileRef = ref(storage, storagePath);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      const contractDoc = await addDoc(collection(db, "contracts"), {
        userId: user.uid,
        title,
        type,
        notes,
        fileUrl,
        fileName: file.name,
        createdAt: serverTimestamp(),
        status: "reviewing",
      });
      contractId = contractDoc.id;

      const contractText = await extractText(file);
      const review = await analyzeContract(contractText);

      const reviewDoc = await addDoc(collection(db, "reviews"), {
        contractId: contractDoc.id,
        userId: user.uid,
        ...review,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "contracts", contractDoc.id), { status: "reviewed" });
      router.push(`/reviews/${reviewDoc.id}`);
    } catch (err) {
      if (contractId) {
        try {
          await updateDoc(doc(db, "contracts", contractId), { status: "failed" });
        } catch {
          // Preserve the original upload or analysis error for the user.
        }
      }
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
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
            {loading ? <AnalysisProgress /> : null}
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
