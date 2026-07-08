# ContractShield AI

ContractShield AI is a production-ready Next.js app that helps small business owners upload service contracts and receive a plain-English AI review, risk level, red flags, key terms, and recommended questions before signing.

Built for **Creignificent LLC**.

> ContractShield AI provides informational assistance only and does not provide legal advice. Consult a qualified attorney before signing legal agreements.

## Features

- Firebase Authentication with Google and Email/Password sign-in
- Secure contract uploads to Firebase Storage
- Firestore-backed `users`, `contracts`, and `reviews` collections
- Server-side contract text extraction for PDF, DOCX, and TXT files
- Server-side Gemini API analysis
- Plain-English summaries
- Low, Medium, and High risk levels
- Red flag detection
- Recommended questions to ask before signing
- Production empty states with no mock data or fake analytics
- Firebase security rules for user-owned data access

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Gemini API
- Vercel-ready deployment

## Environment Variables

Create `.env.local` from `.env.example` for local development.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=
```

`GEMINI_API_KEY` is server-only. Do not prefix it with `NEXT_PUBLIC_`.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If port `3000` is busy, run:

```bash
npm run dev -- --port 3001
```

## Firebase Setup

1. Create a Firebase project.
2. Register a Firebase Web App.
3. Copy the Firebase Web App config into `.env.local`.
4. Enable Firebase Authentication providers:
   - Google
   - Email/password
5. Create a Firestore database in production mode.
6. Enable Firebase Storage.
7. Deploy security rules:

```bash
firebase deploy --only firestore:rules,storage
```

After deploying to Vercel, add the Vercel production domain and any custom domain to Firebase Authentication authorized domains.

## Firestore Data Model

Collections:

- `users`
- `contracts`
- `reviews`

Contract document fields:

- `userId`
- `title`
- `type`
- `notes`
- `fileUrl`
- `fileName`
- `createdAt`
- `status`

Review document fields:

- `contractId`
- `userId`
- `riskLevel`
- `summary`
- `keyTerms`
- `redFlags`
- `recommendations`
- `createdAt`

## Security Rules

Firestore rules are in:

```text
firestore.rules
```

Storage rules are in:

```text
storage.rules
```

Users can only access their own contracts, reviews, and uploaded files.

## AI Analysis

Contract analysis runs server-side in:

```text
src/app/api/analyze-contract/route.ts
```

The route accepts extracted contract text and returns structured JSON:

```json
{
  "riskLevel": "Low | Medium | High",
  "summary": "...",
  "keyTerms": {
    "parties": "",
    "effectiveDate": "",
    "expirationDate": "",
    "autoRenewal": "",
    "paymentTerms": "",
    "terminationNotice": "",
    "insuranceRequirements": "",
    "liability": "",
    "indemnification": "",
    "governingLaw": ""
  },
  "redFlags": [],
  "recommendations": []
}
```

## Deployment To Vercel

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Use default Next.js settings:
   - Build command: `npm run build`
   - Install command: `npm install`
4. Add all environment variables in Vercel.
5. Deploy.
6. Add the Vercel domain to Firebase Authentication authorized domains.
7. Test sign-in, upload, AI analysis, dashboard, review page, and logout.

## Verification

Run before deployment:

```bash
npm run lint
npm run build
```

## Production Checklist

See:

```text
docs/PRODUCTION_READINESS_CHECKLIST.md
```

## Troubleshooting

If Google sign-in works but the app appears stuck, confirm Firestore exists and security rules are deployed.

If upload keeps processing, the app now displays the active stage and will show a timeout/error message for Storage, Firestore, text extraction, or Gemini issues.

If Firebase says the client is offline, confirm:

- Firestore Database exists.
- The app uses the correct Firebase project ID.
- Firestore rules are deployed.
- The current domain is authorized in Firebase Authentication.
- Network/ad blockers are not blocking Firebase requests.

## Legal

ContractShield AI provides informational assistance only and does not provide legal advice. Consult a qualified attorney before signing legal agreements.
