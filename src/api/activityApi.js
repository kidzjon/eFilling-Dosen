import {
  createSubmission,
  getMySubmissions,
  reviewSubmission,
} from "@/services/submission.service";

import { getCurrentUserProfile } from "@/services/auth.service";

export const activityApi = {
  // ===============================
  // DOSEN
  // ===============================
  async getByDosen() {
    const user = await getCurrentUserProfile();
    if (!user) throw new Error("Not authenticated");

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
};
