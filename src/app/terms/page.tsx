import Link from "next/link";
import { BrandMark } from "@/components/brand/shield-logo";
import { legalDisclaimer } from "@/lib/constants";

export const metadata = {
  title: "Terms of Service | ContractShield AI",
  description: "Terms of use for ContractShield AI, a product of Creignificent LLC.",
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-semibold text-foreground">Terms of Service</h1>
        <p>Last updated: September 19, 2026</p>
        <p>
          ContractShield AI is a software product operated by Creignificent LLC (“we,” “us”). By creating an account or
          uploading a document, you agree to these terms.
        </p>
        <h2 className="pt-2 text-lg font-semibold text-foreground">Not legal advice</h2>
        <p>{legalDisclaimer}</p>
        <h2 className="pt-2 text-lg font-semibold text-foreground">The service</h2>
        <p>
          The service reviews uploaded business contracts and returns an informational summary, risk level, key terms, red
          flags, and suggested questions. Output can be incomplete or wrong. You remain responsible for every decision to
          sign, reject, or negotiate an agreement.
        </p>
        <h2 className="pt-2 text-lg font-semibold text-foreground">Accounts and acceptable use</h2>
        <p>
          You must provide accurate account information and keep your login confidential. Do not upload documents you are
          not allowed to share. Do not attempt to abuse, scrape, or overload the service. We may suspend accounts that
          create security, legal, or billing risk.
        </p>
        <h2 className="pt-2 text-lg font-semibold text-foreground">Fees</h2>
        <p>
          Early access may be free or billed separately by invoice or payment link. Paid plans, if offered, are described on
          the sales page or invoice at the time of purchase. API and storage costs incurred by misuse may result in
          suspension.
        </p>
        <h2 className="pt-2 text-lg font-semibold text-foreground">Limitation of liability</h2>
        <p>
          The service is provided “as is.” To the maximum extent allowed by law, Creignificent LLC is not liable for lost
          profits, lost contracts, or damages arising from reliance on AI output. If a court finds liability anyway, it is
          limited to the amount you paid us for the service in the prior 90 days, or $29, whichever is greater.
        </p>
        <h2 className="pt-2 text-lg font-semibold text-foreground">California law</h2>
        <p>These terms are governed by the laws of the State of California, excluding conflict-of-law rules.</p>
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
