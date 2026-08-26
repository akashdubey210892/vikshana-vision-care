import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { firebaseApp } from "./firebase";

export const auth = getAuth(firebaseApp);

const STAFF_EMAIL_DOMAIN = "vikshana.internal";

function usernameToEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${STAFF_EMAIL_DOMAIN}`;
}

let currentUser: User | null = null;
let resolveReady: () => void;
export const authReady: Promise<void> = new Promise((resolve) => {
  resolveReady = resolve;
});

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  resolveReady();
});

export function getCurrentUser(): User | null {
  return currentUser;
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function signInStaff(username: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, usernameToEmail(username), password);
}

export async function signOutStaff(): Promise<void> {
  await signOut(auth);
}
