// Mock API sederhana menggunakan in-memory data

let mockActivities = [
  {
    id: "1",
    title: "Mengajar Grafika Komputer",
    type: "education",
    date: new Date().toISOString(),
    sks: 3,
    status: "approved",
    submittedBy: "u-dosen-1",
  },
  {
    id: "2",
    title: "Penelitian MediaPipe Pose",
    type: "research",
    date: new Date().toISOString(),
    sks: 2,
    status: "pending",
    submittedBy: "u-dosen-1",
  },
];

export const activityApi = {
  getByDosen(userId) {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(mockActivities.filter((a) => a.submittedBy === userId) || []),
        300
      );
    });
  },

  getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = mockActivities.find((a) => a.id === id);
        if (!found) return reject(new Error("Activity not found"));
        resolve(found);
      }, 300);
    });
  },

  create(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newActivity = {
          ...data,
          id: Date.now().toString(),
          status: "pending",
        };
        mockActivities.push(newActivity);
        resolve(newActivity);
      }, 400);
    });
  },

  update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = mockActivities.findIndex((a) => a.id === id);
        if (idx === -1) return reject(new Error("Activity not found"));
        mockActivities[idx] = { ...mockActivities[idx], ...data };
        resolve(mockActivities[idx]);
      }, 400);
    });
  },

  getPendingForAdmin() {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(mockActivities.filter((a) => a.status === "pending")),
        300
      );
    });
  },

  setStatus(id, status, notes = "") {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = mockActivities.findIndex((a) => a.id === id);
        if (idx === -1) return reject(new Error("Activity not found"));
        mockActivities[idx] = {
          ...mockActivities[idx],
          status,
          notes: status === "rejected" ? notes : "",
        };
        resolve(mockActivities[idx]);
      }, 300);
    });
  },
};
