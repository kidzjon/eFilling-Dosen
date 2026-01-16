import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebase";
import { uploadSubmissionFile } from "./storage.service";

// NOTE:
// Kita konsisten pakai collection "activities" (sesuai implementasi teman),
// supaya semua flow (Tambah Kegiatan, Dashboard Dosen, Admin Validasi) nyambung.

// ===============================
// CREATE SUBMISSION (DOSEN)
// ===============================
export async function createSubmission({ data, file, uid }) {
  if (!file) throw new Error("File wajib diupload");

  // 1) buat dokumen activity
  const ref = await addDoc(collection(db, "activities"), {
    ...data,
    dosenId: uid, // penting: dipakai getMySubmissions
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 2) upload file ke storage
  const fileMeta = await uploadSubmissionFile({
    file,
    uid,
    submissionId: ref.id,
  });

  // 3) update dokumen dengan metadata file
  await updateDoc(doc(db, "activities", ref.id), {
    file: fileMeta,
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

// ===============================
// GET SUBMISSIONS BY DOSEN
// ===============================
export async function getMySubmissions(uid) {
  if (!uid) return [];

  const q = query(
    collection(db, "activities"),
    where("dosenId", "==", uid),
    orderBy("createdAt", "desc")
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
    collection(db, "activities"),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function getAllActivitiesForAdmin() {
  const q = query(
    collection(db, "activities"),
    orderBy("createdAt", "desc")
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

  const snap = await getDoc(doc(db, "activities", id));
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
  if (!submissionId) throw new Error("Missing submissionId");

  await updateDoc(doc(db, "activities", submissionId), {
    status,
    reviewNotes: reviewNotes || "",
    reviewedBy: adminUid || null,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastUpdatedBy: adminUid || null,
  });

  return { success: true };
}




