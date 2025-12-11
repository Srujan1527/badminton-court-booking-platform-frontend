import { useState } from "react";
import { API_BASE } from "../helper";

export const AdminCoachAvailabilityForm: React.FC = () => {
  const [coachId, setCoachId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    setMsg("");
    if (!coachId || !dayOfWeek || !startHour || !endHour) {
      setMsg("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/admin/coaches/${Number(coachId)}/availability`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dayOfWeek: Number(dayOfWeek),
            startHour: Number(startHour),
            endHour: Number(endHour),
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data.message || "Failed to create coach availability");
      setMsg("Coach availability added successfully.");
      setCoachId("");
      setDayOfWeek("");
      setStartHour("");
      setEndHour("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 text-sm">
      <h2 className="text-lg font-semibold mb-2 text-slate-900">
        Add Coach Availability
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">Coach ID</label>
          <input
            type="number"
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={coachId}
            onChange={(e) => setCoachId(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">Day of Week (0-6)</label>
          <input
            type="number"
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">Start Hour (0-23)</label>
          <input
            type="number"
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">End Hour (0-23)</label>
          <input
            type="number"
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={endHour}
            onChange={(e) => setEndHour(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs sm:text-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? "Saving..." : "Save Availability"}
      </button>
      {msg && <p className="text-xs mt-1 text-slate-800">{msg}</p>}
    </div>
  );
};
