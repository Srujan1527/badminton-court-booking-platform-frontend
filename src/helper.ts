export const formatForBackend = (value: string) => {
  // datetime-local returns "2025-12-10T10:00"
  // backend expects "2025-12-10 10:00:00"
  if (!value) return "";
  return value.replace("T", " ") + ":00";
};

export const API_BASE = import.meta.env.VITE_BASE_URL;
console.log("url", API_BASE);
