"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";
import { auth, isFirebaseConfigured, missingFirebaseEnvVars } from "@/lib/firebase";
import { syncUserDocument } from "@/lib/user-document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark, ShieldLogo } from "@/components/brand/shield-logo";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "create">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    if (!isFirebaseConfigured) {
      setError(`Firebase setup required. Missing: ${missingFirebaseEnvVars.join(", ")}`);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      void syncUserDocument(result.user).catch(() => {
        // Authentication should not be blocked by a transient Firestore network issue.
      });
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFirebaseConfigured) {
      setError(`Firebase setup required. Missing: ${missingFirebaseEnvVars.join(", ")}`);
      return;
    }

    setError("");
    setLoading(true);
    try {
      if (mode === "create") {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(result.user, { displayName: name });
        }
        void syncUserDocument(result.user, name || result.user.displayName).catch(() => {
          // Authentication should not be blocked by a transient Firestore network issue.
        });
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        void syncUserDocument(result.user).catch(() => {
          // Authentication should not be blocked by a transient Firestore network issue.
        });
      }
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="enterprise-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="hidden space-y-6 lg:block">
          <ShieldLogo size="xl" animated scanning />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Secure workspace</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">Contract review for real business decisions.</h1>
          </div>
        </div>
      <Card className="w-full max-w-md justify-self-center">
        <CardHeader className="space-y-3">
          <Link href="/" aria-label="ContractShield AI home">
            <BrandMark />
          </Link>
          <div>
            <CardTitle>{mode === "create" ? "Create account" : "Welcome back"}</CardTitle>
            <CardDescription>Review smarter. Sign with confidence.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            <LockKeyhole className="h-4 w-4" />
            Continue with Google
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>
          <form className="space-y-4" onSubmit={handleEmail}>
            {mode === "create" ? (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                autoComplete={mode === "create" ? "new-password" : "current-password"}
              />
            </div>
            {error ? <p className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-red-200">{error}</p> : null}
            <Button className="w-full" disabled={loading}>
              {loading ? "Working..." : mode === "create" ? "Create account" : "Sign in"}
            </Button>
          </form>
          <Button type="button" variant="ghost" className="w-full" onClick={() => setMode(mode === "create" ? "login" : "create")}>
            {mode === "create" ? "Already have an account? Sign in" : "Create an account"}
          </Button>
        </CardContent>
      </Card>
      </div>
    </main>
  );
}
