import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
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
