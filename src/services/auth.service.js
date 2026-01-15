// src/services/auth.service.js
import {
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

// ===============================
// GET CURRENT USER PROFILE
// ===============================
export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    uid: user.uid,
    ...snap.data(),
  };
}

// ===============================
// ENSURE USER PROFILE
// ===============================
export async function ensureUserProfile(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName ?? "",
      email: user.email,
      role: "dosen", // default role
      isActive: true,
      createdAt: serverTimestamp(),
    });
  }
}

// ===============================
// EMAIL + PASSWORD LOGIN
// ===============================
export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(cred.user);
  return cred.user;
}

// ===============================
// GOOGLE LOGIN
// ===============================
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  await ensureUserProfile(cred.user);
  return cred.user;
}

// ===============================
// REGISTER EMAIL + PASSWORD
// ===============================
export async function registerWithEmail(email, password, name = "") {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email: cred.user.email,
    role: "dosen",        // DEFAULT, TIDAK BISA DIPILIH
    isActive: true,
    createdAt: serverTimestamp(),
  });

  return cred.user;
}

// ===============================
// LOGOUT
// ===============================
export async function logout() {
  await signOut(auth);
}
