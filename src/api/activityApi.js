import {
  createSubmission,
  getMySubmissions,
  reviewSubmission,
} from "@/services/submission.service";

import { getCurrentUserProfile } from "@/services/auth.service";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";

export const activityApi = {
  // ===============================
  // DOSEN
  // ===============================
  async getActivities() {
    const user = await getCurrentUserProfile();
    if (!user) return [];
    return await getMySubmissions(user.uid);
  },

  async createActivity({ data, file }) {
    const user = await getCurrentUserProfile();
    if (!user) throw new Error("Not authenticated");

    await createSubmission({
      data,
      file,
      uid: user.uid,
    });

    return { success: true };
  },

  // ===============================
  // ADMIN
  // ===============================
  async updateActivityStatus(id, status, notes = "") {
    const admin = await getCurrentUserProfile();
    if (!admin) throw new Error("Not authenticated");

    await reviewSubmission({
      submissionId: id,
      status,
      reviewNotes: notes,
      adminUid: admin.uid,
    });

    return { success: true };
  },
    async getByDosen(dosenId) {
    const q = query(
      collection(db, "activities"),
      where("dosenId", "==", dosenId)
    );

    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};
