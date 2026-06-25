# ContractShield AI

ContractShield AI helps small business owners upload service contracts and receive a plain-English review summary, risk level, red flags, and recommended questions before signing.

Built for Creignificent LLC with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui-style components, Firebase Authentication, Firestore, Firebase Storage, and Gemini.

## Environment Variables

Create `.env.local` from `.env.example` for local development. Add the same values to Vercel before production deployment.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=
```

`GEMINI_API_KEY` is server-only and must never be prefixed with `NEXT_PUBLIC_`.

## Firebase Setup

1. Create a Firebase project.
2. Register a Firebase Web App.
3. Copy the Web App config values into `.env.local`.
4. Enable Firebase Authentication providers:
   - Google
   - Email/password
5. Create a Firestore database in production mode.
6. Enable Firebase Storage.
7. Deploy security rules:

```bash
firebase deploy --only firestore:rules,storage
```

8. After deploying to Vercel, add the Vercel domain and any custom domain to Firebase Authentication authorized domains.

## Local Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Verify before deployment:

```bash
npm run lint
npm run build
```

## Data Model

Firestore collections:

- `users`
- `contracts`
- `reviews`

Each contract stores `userId`, `title`, `type`, `notes`, `fileUrl`, `fileName`, `createdAt`, and `status`.

Each review stores `contractId`, `userId`, `riskLevel`, `summary`, `keyTerms`, `redFlags`, `recommendations`, and `createdAt`.

Security rules require authenticated users to access only their own `users`, `contracts`, and `reviews` documents. Storage rules restrict contract files to `contracts/{userId}/...`.

## AI Review

`POST /api/analyze-contract` accepts extracted contract text and returns structured JSON with `riskLevel`, `summary`, `keyTerms`, `redFlags`, and `recommendations`.

The Gemini API key is read only in the server-side route at `src/app/api/analyze-contract/route.ts`.

## Missing Configuration Behavior

If Firebase public environment variables are missing, authenticated app areas display a setup-required message instead of attempting Firebase operations with invalid credentials.

If `GEMINI_API_KEY` is missing, `/api/analyze-contract` returns an error and no review record is generated.

## Production Checklist

See `docs/PRODUCTION_READINESS_CHECKLIST.md`.

## Legal Disclaimer

ContractShield AI provides informational assistance only and does not provide legal advice. Consult a qualified attorney before signing legal agreements.
