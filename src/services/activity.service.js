import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

export async function createActivity({
  title,
  category,
  year,
  file,
  dosen
}) {
  // VALIDASI FILE
  if (!file) throw new Error("File wajib diupload");
  if (file.size > 10 * 1024 * 1024)
    throw new Error("Ukuran file maksimal 10MB");

  // 1️⃣ BUAT DOKUMEN FIRESTORE DULU
  const docRef = await addDoc(collection(db, "activities"), {
    title,
    category,
    year,
    dosenId: dosen.uid,
    dosenName: dosen.name,
    status: "pending",
    adminNote: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 2️⃣ UPLOAD FILE KE STORAGE
  const fileRef = ref(
    storage,
    `efilling/${dosen.uid}/${docRef.id}/${file.name}`
  );

  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  // 3️⃣ UPDATE DOKUMEN DENGAN INFO FILE
  await updateDoc(docRef, {
    file: {
      name: file.name,
      url,
      size: file.size,
    },
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getActivitiesByDosen(dosenId) {
  const q = query(
    collection(db, "activities"),
    where("dosenId", "==", dosenId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Ambil detail satu aktivitas
 */
export async function getActivityById(id) {
  const ref = doc(db, "activities", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error("Activity not found");

  return {
    id: snap.id,
    ...snap.data(),
  };
}