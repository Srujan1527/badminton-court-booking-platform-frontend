import { useState } from "react";
import type {
  AppliesTo,
  CreatePricingRuleInput,
  RuleType,
} from "../types/types";
import { API_BASE } from "../helper";

export const AdminPricingRuleForm: React.FC = () => {
  type YesNoAny = "" | "yes" | "no";
  const [name, setName] = useState("");
  const [appliesTo, setAppliesTo] = useState<
    "COURT" | "EQUIPMENT" | "COACH" | "OVERALL"
  >("COURT");
  const [isWeekend, setIsWeekend] = useState<YesNoAny>("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [indoorOnly, setIndoorOnly] = useState<YesNoAny>("");
  const [ruleType, setRuleType] = useState<"MULTIPLIER" | "FLAT">("MULTIPLIER");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    setMsg("");
    if (!name || !value) {
      setMsg("Name and value are required.");
      return;
    }
    setLoading(true);
    try {
      const payload: CreatePricingRuleInput = {
        name,
        appliesTo,
        ruleType,
        value: Number(value),
      };

      payload.isWeekend =
        isWeekend === "" ? null : isWeekend === "yes" ? true : false;

      payload.indoorOnly =
        indoorOnly === "" ? null : indoorOnly === "yes" ? true : false;

      payload.startHour = startHour === "" ? null : Number(startHour);
      payload.endHour = endHour === "" ? null : Number(endHour);

      const res = await fetch(`${API_BASE}/admin/pricing-rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data.message || "Failed to create pricing rule");
      setMsg("Pricing rule created successfully.");
      setName("");
      setValue("");
      setIsWeekend("");
      setStartHour("");
      setEndHour("");
      setIndoorOnly("");
      setRuleType("MULTIPLIER");
      setAppliesTo("COURT");
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
        Add Pricing Rule
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">Name</label>
          <input
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">Applies To</label>
          <select
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={appliesTo}
            onChange={(e) => setAppliesTo(e.target.value as AppliesTo)}
          >
            <option value="COURT">Court</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="COACH">Coach</option>
            <option value="OVERALL">Overall</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">Rule Type</label>
          <select
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={ruleType}
            onChange={(e) => setRuleType(e.target.value as RuleType)}
          >
            <option value="MULTIPLIER">Multiplier</option>
            <option value="FLAT">Flat</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">
            Value {ruleType === "MULTIPLIER" ? "(e.g. 1.5)" : "(₹)"}
          </label>
          <input
            type="number"
            step="0.1"
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">Weekend Only?</label>
          <select
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={isWeekend}
            onChange={(e) => setIsWeekend(e.target.value as YesNoAny)}
          >
            <option value="">Any</option>
            <option value="yes">Weekend Only</option>
            <option value="no">Weekdays Only</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">Indoor Only?</label>
          <select
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={indoorOnly}
            onChange={(e) => setIndoorOnly(e.target.value as YesNoAny)}
          >
            <option value="">Any</option>
            <option value="yes">Indoor Only</option>
            <option value="no">Outdoor Only</option>
          </select>
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
        {loading ? "Saving..." : "Save Pricing Rule"}
      </button>
      {msg && <p className="text-xs mt-1 text-slate-800">{msg}</p>}
    </div>
  );
};
