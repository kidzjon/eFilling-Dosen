import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  getDoc, // ✅ TAMBAHAN
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";
import { uploadSubmissionFile } from "./storage.service";

// ===============================
// CREATE SUBMISSION (DOSEN)
// ===============================
export async function createSubmission({ data, file, uid }) {
  if (!file) throw new Error("File wajib diupload");

  const ref = await addDoc(collection(db, "submissions"), {
    ...data,
    submittedBy: uid,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const fileMeta = await uploadSubmissionFile({
    file,
    uid,
    submissionId: ref.id,
  });

  await updateDoc(doc(db, "submissions", ref.id), {
    file: fileMeta,
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

// ===============================
// GET SUBMISSIONS BY DOSEN
// ===============================
export async function getMySubmissions(uid) {
  const q = query(
    collection(db, "submissions"),
    where("submittedBy", "==", uid)
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// ===============================
// GET ALL PENDING (ADMIN)
// ===============================
export async function getPendingSubmissions() {
  const q = query(
    collection(db, "submissions"),
    where("status", "==", "pending")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// ===============================
// GET DETAIL SUBMISSION BY ID
// ===============================
export async function getSubmissionById(id) {
  if (!id) throw new Error("Missing submission id");

  const snap = await getDoc(doc(db, "submissions", id));
  if (!snap.exists()) throw new Error("Submission not found");

  return {
    id: snap.id,
    ...snap.data(),
  };
}

// ===============================
// REVIEW SUBMISSION (ADMIN)
// ===============================
export async function reviewSubmission({
  submissionId,
  status,
  reviewNotes,
  adminUid,
}) {
  await updateDoc(doc(db, "submissions", submissionId), {
    status,
    reviewNotes,
    reviewedBy: adminUid,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastUpdatedBy: adminUid,
  });
}
