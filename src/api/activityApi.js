// src/api/activityApi.js
import {
  createSubmission,
  getMySubmissions,
  reviewSubmission,
  getPendingSubmissions,
  getSubmissionById,
  getAllActivitiesForAdmin
} from "@/services/submission.service";

import { getCurrentUserProfile } from "@/services/auth.service";

export const activityApi = {
  // ===============================
  // DOSEN
  // ===============================
  // Bisa dipanggil tanpa uid (pakai current user),
  // atau pakai uid (untuk kompatibilitas lama).
  async getByDosen(uid) {
    // kompatibilitas lama: kalau uid dikirim
    if (uid) return await getMySubmissions(uid);

    // default: current logged-in user
    const user = await getCurrentUserProfile();
    if (!user) throw new Error("Not authenticated");
    return await getMySubmissions(user.uid);
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
    if (admin.role !== "admin") throw new Error("Forbidden");
    return await getPendingSubmissions();
  },
  async getAllForAdmin() {
    const admin = await getCurrentUserProfile();
    if (!admin) throw new Error("Not authenticated");
    if (admin.role !== "admin") throw new Error("Forbidden");
    return await getAllActivitiesForAdmin();
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
