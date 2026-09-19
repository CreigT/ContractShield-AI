# Production Readiness Checklist

## Done in code

- [x] Firebase Auth required on `/api/extract-contract-text` and `/api/analyze-contract`
- [x] Per-user hourly review rate limit
- [x] Contract text length cap
- [x] Firestore owner-only rules in `firestore.rules`
- [x] Storage owner-only rules in `storage.rules`
- [x] Gemini key is server-only (`GEMINI_API_KEY`)
- [x] Terms of Service page at `/terms`
- [x] Privacy Policy page at `/privacy`
- [x] Security headers in `next.config.ts`
- [x] Configurable Gemini model via `GEMINI_MODEL`

## Operator steps before first stranger uses it

- [ ] Create a dedicated Firebase project for ContractShield AI
- [ ] Enable Google + email/password Authentication
- [ ] Create Firestore in production mode
- [ ] Enable Firebase Storage
- [ ] Deploy `firestore.rules` and `storage.rules`
- [ ] Put all `.env.example` values in Vercel
- [ ] Confirm `GEMINI_MODEL` works in your Google AI project (`gemini-2.0-flash` or `gemini-1.5-flash`)
- [ ] Add the Vercel domain to Firebase Authentication authorized domains
- [ ] Set Firebase and Gemini billing alerts
- [ ] Connect the repo to Vercel and deploy
- [ ] Sign in on the live URL and review one real PDF, one DOCX, and one TXT
- [ ] Confirm a second account cannot see the first account's contracts

## After first paid customer

- [ ] Add Stripe or invoice payment
- [ ] Have a lawyer review `/terms` and `/privacy`
- [ ] Transfer the repo to the Creignificent GitHub organization
