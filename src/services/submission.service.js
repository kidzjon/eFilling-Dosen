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

// ===============================
// CREATE SUBMISSION (DOSEN)
// ===============================
export async function createSubmission({ data, file, uid }) {
  if (!file) throw new Error("File wajib diupload");

  // auto year kalau belum ada
  const derivedYear = data?.year
    ? Number(data.year)
    : data?.date
    ? new Date(data.date).getFullYear()
    : null;

  // 1) buat dokumen activity
  const refDoc = await addDoc(collection(db, "activities"), {
    ...data,
    year: derivedYear,
    dosenId: uid,
    status: "pending",
    reviewNotes: "",
    reviewedBy: null,
    reviewedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 2) upload file
  const fileMeta = await uploadSubmissionFile({
    file,
    uid,
    submissionId: refDoc.id,
  });

  // 3) update dokumen dengan attachment (standar)
  await updateDoc(doc(db, "activities", refDoc.id), {
    attachment: fileMeta,
    // compat (optional): biar data lama yang baca `file.downloadUrl` tetap hidup
    file: { ...fileMeta, downloadUrl: fileMeta.url },
    updatedAt: serverTimestamp(),
  });

  return refDoc.id;
}

// ===============================
// UPDATE SUBMISSION (DOSEN)
// - dipakai edit + ajukan ulang
// ===============================
export async function updateSubmission({ id, data, file, uid }) {
  if (!id) throw new Error("Missing submission id");

  const docRef = doc(db, "activities", id);

  // auto year kalau belum ada
  const derivedYear = data?.year
    ? Number(data.year)
    : data?.date
    ? new Date(data.date).getFullYear()
    : null;

  // update fields dulu
  await updateDoc(docRef, {
    ...data,
    year: derivedYear,
    // setiap edit = ajukan ulang
    status: "pending",
    reviewNotes: "",
    reviewedBy: null,
    reviewedAt: null,
    updatedAt: serverTimestamp(),
    lastUpdatedBy: uid || null,
  });

  // kalau upload file baru
  if (file) {
    const fileMeta = await uploadSubmissionFile({
      file,
      uid: uid,
      submissionId: id,
    });

    await updateDoc(docRef, {
      attachment: fileMeta,
      file: { ...fileMeta, downloadUrl: fileMeta.url }, // compat
      updatedAt: serverTimestamp(),
      lastUpdatedBy: uid || null,
    });
  }

  return { success: true };
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
  const q = query(collection(db, "activities"), orderBy("createdAt", "desc"));

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// ===============================
// GET ALL ACTIVITIES (PIMPINAN / READONLY)
// ===============================
export async function getAllActivitiesForPimpinan() {
  const q = query(collection(db, "activities"), orderBy("createdAt", "desc"));

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
