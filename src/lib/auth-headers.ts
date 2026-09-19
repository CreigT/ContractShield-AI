import { auth } from "@/lib/firebase";

export async function getAuthHeaders(extra?: HeadersInit): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Sign in required.");
  }

  const token = await user.getIdToken();
  return {
    ...(extra ?? {}),
    Authorization: `Bearer ${token}`,
  };
}
