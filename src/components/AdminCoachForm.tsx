import { useState } from "react";
import { API_BASE } from "../helper";

export const AdminCoachForm: React.FC = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    setMsg("");
    if (!name || !hourlyRate) {
      setMsg("Name and hourly rate are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/coaches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          hourlyRate: Number(hourlyRate),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to create coach");
      setMsg("Coach created successfully.");
      setName("");
      setBio("");
      setHourlyRate("");
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
      <h2 className="text-lg font-semibold mb-2 text-slate-900">Add Coach</h2>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col flex-1">
            <label className="mb-1 text-slate-700">Name</label>
            <input
              className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-slate-700">Hourly Rate (₹)</label>
            <input
              type="number"
              className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">Bio (optional)</label>
          <textarea
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs sm:text-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? "Saving..." : "Save Coach"}
      </button>
      {msg && <p className="text-xs mt-1 text-slate-800">{msg}</p>}
    </div>
  );
};
