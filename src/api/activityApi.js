// src/api/activityApi.js
import {
  createSubmission,
  getMySubmissions,
  reviewSubmission,
  getPendingSubmissions,
  getSubmissionById,
} from "@/services/submission.service";

import { getCurrentUserProfile } from "@/services/auth.service";

export const activityApi = {
  // ===============================
  // DOSEN
  // ===============================
  async getActivities() {
    const user = await getCurrentUserProfile();
    if (!user) return [];
    return await getMySubmissions(user.uid);
  },

  // Alias supaya ActivityList lama tetap jalan
  async getByDosen(uid) {
    if (!uid) return [];
    return await getMySubmissions(uid);
  },

  // Dipakai ActivityDetail / ActivityForm(edit) / ValidationDetail
  async getById(id) {
    if (!id) throw new Error("Missing id");
    return await getSubmissionById(id);
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
  // Dipakai DashboardAdmin + ValidationQueue
  async getPendingForAdmin() {
    const admin = await getCurrentUserProfile();
    if (!admin) throw new Error("Not authenticated");
    return await getPendingSubmissions();
  },

  // method asli yang sudah ada
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

  // Alias supaya ValidationDetail lama tetap jalan
  async setStatus(id, status, notes = "") {
    return await this.updateActivityStatus(id, status, notes);
  },
};
