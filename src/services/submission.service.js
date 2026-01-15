import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";
import { uploadSubmissionFile } from "./storage.service";


export async function createSubmission({ data, file, uid }) {
  // 1. create empty submission
  const ref = await addDoc(collection(db, "submissions"), {
    ...data,
    submittedBy: uid,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 2. upload file
  const fileMeta = await uploadSubmissionFile({
    file,
    uid,
    submissionId: ref.id,
  });

  // 3. update submission with file
  await updateDoc(doc(db, "submissions", ref.id), {
    file: fileMeta,
  });

  return ref.id;
}

export async function getMySubmissions(uid) {
  const q = query(
    collection(db, "submissions"),
    where("submittedBy", "==", uid)
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
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