// src/services/storage.service.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg"];

export function validateFile(file) {
  if (!file) throw new Error("File is required");
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("File type not allowed");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Max file size is 10MB");
  }
}

function safeFileName(name) {
  return `${Date.now()}_${String(name || "file").replace(/\s+/g, "_")}`;
}

export async function uploadSubmissionFile({ file, uid, submissionId }) {
  validateFile(file);

  const filename = safeFileName(file.name);
  const path = `efilling/${uid}/${submissionId}/${filename}`;
  const fileRef = ref(storage, path);

  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  return {
    name: filename,
    contentType: file.type,
    size: file.size,
    path,
    url,
  };
}
