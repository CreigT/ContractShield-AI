import type { User } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

export async function syncUserDocument(user: User, displayName = user.displayName) {
  if (!isFirebaseConfigured) return;

  await setDoc(
    doc(db, "users", user.uid),
    {
      email: user.email,
      displayName,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true },
  );
}
