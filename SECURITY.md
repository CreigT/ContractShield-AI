# Security Policy

ContractShield AI handles contracts and account data, so security and privacy are core requirements.

## Baseline Requirements

- Never commit `.env.local`, API keys, Firebase service credentials, or private contract documents.
- Keep `GEMINI_API_KEY` server-only and never expose it through `NEXT_PUBLIC_` variables.
- Enforce Firebase Authentication before access to user-owned data.
- Maintain Firestore and Storage rules so users can access only their own records and uploads.
- Validate uploaded file type, size, and parsed content before AI processing.
- Treat AI output as informational assistance, not authoritative legal advice.
- Log operational failures without placing sensitive contract content into logs.
- Use least-privilege credentials for deployment and integrations.

## Verification Before Production

At minimum, verify authentication, authorization, upload controls, Firestore rules, Storage rules, AI route protection, error handling, and logout behavior in the production environment.

## Reporting a Security Issue

Do not post credentials, private contracts, personal information, or exploit details in a public issue. Report sensitive concerns privately to the project owner through an established Creignificent LLC contact channel.

---

**Sponsored by CREIGNIFICENT LLC.**
