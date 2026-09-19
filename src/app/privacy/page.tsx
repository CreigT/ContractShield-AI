import Link from "next/link";
import { BrandMark } from "@/components/brand/shield-logo";

export const metadata = {
  title: "Privacy Policy | ContractShield AI",
  description: "How ContractShield AI handles contract files and account data.",
};

export default function PrivacyPage() {
  return (
    <main className="enterprise-bg min-h-screen">
      <header className="border-b border-white/10 bg-[#0B0B0D]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link href="/" aria-label="ContractShield AI home">
            <BrandMark />
          </Link>
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/">
            Home
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-sm leading-7 text-muted-foreground">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Creignificent LLC</p>
        <h1 className="text-3xl font-semibold text-foreground">Privacy Policy</h1>
        <p>Last updated: September 19, 2026</p>
        <p>
          This policy describes how ContractShield AI, operated by Creignificent LLC, handles information when you use the
          app.
        </p>
        <h2 className="pt-2 text-lg font-semibold text-foreground">What we collect</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Account data: name, email, and authentication identifiers from email/password or Google sign-in.</li>
          <li>Contract files you upload, extracted text, and AI reviews generated from those files.</li>
          <li>Basic technical logs needed to operate and secure the service.</li>
        </ul>
        <h2 className="pt-2 text-lg font-semibold text-foreground">How we use it</h2>
        <p>
          We use this information to authenticate you, store your documents, generate reviews, prevent abuse, and improve
          reliability. We do not sell your contracts. Uploaded documents are sent to our AI provider only to produce your
          requested review.
        </p>
        <h2 className="pt-2 text-lg font-semibold text-foreground">Retention</h2>
        <p>
          Contract files and reviews remain in your account until you delete them or request deletion by emailing
          Creignificent@gmail.com. We may keep limited records as required for security, billing, or law.
        </p>
        <h2 className="pt-2 text-lg font-semibold text-foreground">Processors</h2>
        <p>
          Infrastructure may include Firebase/Google Cloud for auth, database, and file storage; Google Gemini for analysis;
          and Vercel for hosting. Each processor handles data only to provide that function.
        </p>
        <h2 className="pt-2 text-lg font-semibold text-foreground">Your choices</h2>
        <p>
          You can access or delete account data by signing in or emailing Creignificent@gmail.com. California residents may
          request access or deletion of personal information as provided by applicable law.
        </p>
        <h2 className="pt-2 text-lg font-semibold text-foreground">Contact</h2>
        <p>
          Creignificent LLC
          <br />
          Email: Creignificent@gmail.com
        </p>
      </article>
    </main>
  );
}
