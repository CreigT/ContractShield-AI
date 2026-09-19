import { NextResponse } from "next/server";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_HOUR = 15;

type RateBucket = { count: number; resetAt: number };
const rateLimitByUid = new Map<string, RateBucket>();

export type AuthedUser = {
  uid: string;
  email?: string;
};

function unauthorized(message = "Sign in required.") {
  return NextResponse.json({ error: message }, { status: 401 });
}

function tooMany(resetAt: number) {
  const retryMin = Math.max(1, Math.ceil((resetAt - Date.now()) / 60000));
  return NextResponse.json(
    { error: `Review limit reached. Try again in about ${retryMin} minute(s).` },
    { status: 429 },
  );
}

function consumeRateLimit(uid: string) {
  const now = Date.now();
  const current = rateLimitByUid.get(uid);

  if (!current || now >= current.resetAt) {
    const next = { count: 1, resetAt: now + WINDOW_MS };
    rateLimitByUid.set(uid, next);
    return { ok: true as const };
  }

  if (current.count >= MAX_REQUESTS_PER_HOUR) {
    return { ok: false as const, resetAt: current.resetAt };
  }

  current.count += 1;
  rateLimitByUid.set(uid, current);
  return { ok: true as const };
}

export async function requireUser(request: Request): Promise<AuthedUser | NextResponse> {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token) {
    return unauthorized();
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server authentication is not configured." }, { status: 500 });
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });

  if (!response.ok) {
    return unauthorized("Session expired. Sign in again.");
  }

  const data = (await response.json()) as {
    users?: Array<{ localId?: string; email?: string }>;
  };
  const uid = data.users?.[0]?.localId;

  if (!uid) {
    return unauthorized("Session expired. Sign in again.");
  }

  const limit = consumeRateLimit(uid);
  if (!limit.ok) {
    return tooMany(limit.resetAt);
  }

  return { uid, email: data.users?.[0]?.email };
}
