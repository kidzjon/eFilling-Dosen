export const formatDate = (value) => {
  if (!value) return "-";

  // Firestore Timestamp (toDate)
  if (value?.toDate) {
    const d = value.toDate();
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // Firestore Timestamp (seconds)
  if (typeof value === "object" && value?.seconds) {
    const d = new Date(value.seconds * 1000);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // Date / string
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d)) return "-";

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
