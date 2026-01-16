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
  description,
  category,
  date,
  sks,
  year,
  file,
  dosen
}) {
  if (!file) throw new Error("File wajib diupload");
  if (file.size > 10 * 1024 * 1024)
    throw new Error("Ukuran file maksimal 10MB");

  const docRef = await addDoc(collection(db, "activities"), {
    title,
    description: description || "",
    category,
    date, // ISO string
    sks: Number(sks) || 0,
    year,
    dosenId: dosen.uid,
    dosenName: dosen.name,
    status: "pending",
    adminNote: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const safeName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const fileRef = ref(
    storage,
    `efilling/${dosen.uid}/${docRef.id}/${safeName}`
  );

  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  await updateDoc(docRef, {
    attachment: {
      name: safeName,
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