# Production Readiness Checklist

## Firebase

- Create a dedicated Firebase project for ContractShield AI.
- Register a Firebase Web App.
- Enable Google Authentication.
- Enable Email/password Authentication.
- Create Firestore in production mode.
- Enable Firebase Storage.
- Deploy `firestore.rules`.
- Deploy `storage.rules`.
- Add the Vercel production domain to Firebase Authentication authorized domains.
- Add any custom production domain to Firebase Authentication authorized domains.

## Environment Variables

- Create local `.env.local` from `.env.example`.
- Add these variables locally and in Vercel:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=
```

- Confirm `.env.local` is not committed.
- Confirm `GEMINI_API_KEY` is not prefixed with `NEXT_PUBLIC_`.
- Confirm `GEMINI_API_KEY` is used only in server-side code.

## Security Rules

- Confirm Firestore rules allow users to read and write only their own `users`, `contracts`, and `reviews`.
- Confirm Storage rules allow users to read and write only under `contracts/{userId}/...`.
- Test unauthorized access between two separate accounts.
- Confirm no Gemini key is exposed in browser bundles or client components.

## App Verification

- Run `npm run lint`.
- Run `npm run build`.
- Create a test user with email/password.
- Sign in with Google.
- Upload a real TXT contract.
- Upload a real PDF contract.
- Upload a real DOCX contract.
- Confirm a real contract file is written to Firebase Storage.
- Confirm a real contract document is written to Firestore.
- Confirm a review document is written only after Gemini analysis succeeds.
- Confirm no mock contracts, fake analytics, placeholder records, hardcoded risk scores, or simulated reviews appear anywhere in the app.

## Production Deployment

- Connect the repository to Vercel.
- Add all environment variables to Vercel.
- Deploy to Vercel.
- Run an end-to-end test on the deployed URL.
- Confirm dashboard empty states display when no real data exists.
- Confirm users can only see their own contracts and reviews.

## Legal And Operations

- Add or verify Terms of Service.
- Add or verify Privacy Policy.
- Review the legal disclaimer with a qualified attorney.
- Define a contract document retention policy.
- Configure Firebase billing alerts.
- Configure Gemini/API billing alerts.
- Monitor Vercel runtime logs and failed API requests.
