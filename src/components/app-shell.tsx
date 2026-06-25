"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Upload, LayoutDashboard, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { auth, isFirebaseConfigured, missingFirebaseEnvVars } from "@/lib/firebase";
import { syncUserDocument } from "@/lib/user-document";
import { Button } from "@/components/ui/button";
import { BrandMark, ShieldLogo } from "@/components/brand/shield-logo";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      void syncUserDocument(currentUser).catch(() => {
        // Keep the authenticated app usable even if Firestore is temporarily unreachable.
      });
    });

    return unsubscribe;
  }, [router]);

  if (loading) {
    return (
      <main className="enterprise-bg flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        <ShieldLogo size="lg" animated scanning />
      </main>
    );
  }

  if (!user) {
    if (!isFirebaseConfigured) {
      return (
        <main className="enterprise-bg flex min-h-screen items-center justify-center px-4">
          <div className="glass-panel max-w-xl rounded-2xl p-6 text-center">
            <ShieldLogo size="lg" />
            <h1 className="mt-4 text-2xl font-semibold">Firebase setup required</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Add the required Firebase environment variables to `.env.local` for local development or to your Vercel project
              settings for production.
            </p>
            <p className="mt-4 break-words rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-muted-foreground">
              Missing: {missingFirebaseEnvVars.join(", ")}
            </p>
          </div>
        </main>
      );
    }

    return null;
  }

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/upload", label: "Upload", icon: Upload },
  ];

  return (
    <div className="enterprise-bg min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0D]/82 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" aria-label="ContractShield AI dashboard">
            <BrandMark />
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((item) => (
              <Button key={item.href} variant={pathname === item.href ? "secondary" : "ghost"} size="sm" asChild>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await signOut(auth);
              router.replace("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-[#0B0B0D]/95 backdrop-blur sm:hidden">
        <div className="grid grid-cols-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-14 flex-col items-center justify-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
