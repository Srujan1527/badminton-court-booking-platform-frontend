import { useState } from "react";
import { API_BASE } from "../helper";

export const AdminCourtForm: React.FC = () => {
  const [name, setName] = useState("");
  const [isIndoor, setIsIndoor] = useState(true);
  const [baseRate, setBaseRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    setMsg("");
    if (!name || !baseRate) {
      setMsg("Name and base hourly rate are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/courts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          isIndoor,
          baseHourlyRate: Number(baseRate),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to create court");
      setMsg("Court created successfully.");
      setName("");
      setBaseRate("");
      setIsIndoor(true);
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
      <h2 className="text-lg font-semibold mb-2 text-slate-900">Add Court</h2>
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
          <label className="mb-1 text-slate-700">Indoor?</label>
          <select
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={isIndoor ? "yes" : "no"}
            onChange={(e) => setIsIndoor(e.target.value === "yes")}
          >
            <option value="yes">Indoor</option>
            <option value="no">Outdoor</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">Base Hourly Rate (₹)</label>
          <input
            type="number"
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs sm:text-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? "Saving..." : "Save Court"}
      </button>
      {msg && <p className="text-xs mt-1 text-slate-800">{msg}</p>}
    </div>
  );
};
