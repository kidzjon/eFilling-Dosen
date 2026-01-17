// src/api/activityApi.js
import {
  createSubmission,
  updateSubmission,
  getMySubmissions,
  reviewSubmission,
  getPendingSubmissions,
  getSubmissionById,
  getAllActivitiesForAdmin,
  getAllActivitiesForPimpinan,
} from "@/services/submission.service";

import { getCurrentUserProfile } from "@/services/auth.service";

export const activityApi = {
  // ===============================
  // DOSEN
  // ===============================
  async getByDosen(uid) {
    if (uid) return await getMySubmissions(uid);

    const user = await getCurrentUserProfile();
    if (!user) throw new Error("Not authenticated");
    return await getMySubmissions(user.uid);
  },

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

  async updateActivity({ id, data, file }) {
    const user = await getCurrentUserProfile();
    if (!user) throw new Error("Not authenticated");

    await updateSubmission({
      id,
      data,
      file: file || null,
      uid: user.uid,
    });

    return { success: true };
  },

  // ===============================
  // ADMIN
  // ===============================
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

  // ===============================
  // PIMPINAN
  // ===============================
  async getAllForPimpinan() {
    const user = await getCurrentUserProfile();
    if (!user) throw new Error("Not authenticated");
    if (user.role !== "pimpinan") throw new Error("Forbidden");
    return await getAllActivitiesForPimpinan();
  },

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

  async setStatus(id, status, notes = "") {
    return await this.updateActivityStatus(id, status, notes);
  },
};
