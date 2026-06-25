declare module "firebase/app" {
  export type FirebaseApp = unknown;
  export function initializeApp(config: Record<string, string | undefined>): FirebaseApp;
  export function getApp(): FirebaseApp;
  export function getApps(): FirebaseApp[];
}

declare module "firebase/auth" {
  import type { FirebaseApp } from "firebase/app";

  export type User = {
    uid: string;
    email: string | null;
    displayName: string | null;
  };

  export type Auth = {
    currentUser: User | null;
  };
  export class GoogleAuthProvider {}
  export function getAuth(app: FirebaseApp): Auth;
  export function onAuthStateChanged(auth: Auth, callback: (user: User | null) => void): () => void;
  export function signOut(auth: Auth): Promise<void>;
  export function signInWithPopup(auth: Auth, provider: GoogleAuthProvider): Promise<{ user: User }>;
  export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<{ user: User }>;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<{ user: User }>;
  export function updateProfile(user: User, profile: { displayName?: string | null }): Promise<void>;
}

declare module "firebase/firestore" {
  import type { FirebaseApp } from "firebase/app";

  export type Timestamp = {
    toDate(): Date;
  };

  export type Firestore = unknown;
  export type FirestoreSettings = {
    experimentalAutoDetectLongPolling?: boolean;
  };
  export type DocumentReference = { id: string };
  export type QueryDocumentSnapshot = { id: string; data(): Record<string, unknown> };
  export type QuerySnapshot = { docs: QueryDocumentSnapshot[] };
  export function getFirestore(app: FirebaseApp): Firestore;
  export function initializeFirestore(app: FirebaseApp, settings?: FirestoreSettings): Firestore;
  export function collection(db: Firestore, path: string): unknown;
  export function doc(db: Firestore, path: string, id: string): DocumentReference;
  export function addDoc(reference: unknown, data: Record<string, unknown>): Promise<DocumentReference>;
  export function getDoc(reference: DocumentReference): Promise<{ id: string; exists(): boolean; data(): Record<string, unknown> }>;
  export function setDoc(reference: DocumentReference, data: Record<string, unknown>, options?: { merge?: boolean }): Promise<void>;
  export function updateDoc(reference: DocumentReference, data: Record<string, unknown>): Promise<void>;
  export function serverTimestamp(): unknown;
  export function where(field: string, operator: string, value: unknown): unknown;
  export function orderBy(field: string, direction?: "asc" | "desc"): unknown;
  export function query(reference: unknown, ...constraints: unknown[]): unknown;
  export function onSnapshot(
    reference: unknown,
    callback: (snapshot: QuerySnapshot) => void,
    onError?: (error: unknown) => void,
  ): () => void;
}

declare module "firebase/storage" {
  import type { FirebaseApp } from "firebase/app";

  export type FirebaseStorage = unknown;
  export type StorageReference = unknown;
  export function getStorage(app: FirebaseApp): FirebaseStorage;
  export function ref(storage: FirebaseStorage, path: string): StorageReference;
  export function uploadBytes(reference: StorageReference, file: Blob): Promise<unknown>;
  export function getDownloadURL(reference: StorageReference): Promise<string>;
}
