import React, { useState } from "react";
import { BookingPage } from "./components/BookingPage";

// ---------- Types ----------

// ---------- Helper ----------

// ---------- Main App ----------
const App: React.FC = () => {
  const [view, setView] = useState<"booking" | "admin">("booking");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold">
          Sports Facility Booking Platform
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setView("booking")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded text-sm font-medium transition ${
              view === "booking"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-slate-200 text-slate-800 hover:bg-slate-300"
            }`}
          >
            Booking
          </button>
          <button
            onClick={() => setView("admin")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded text-sm font-medium transition ${
              view === "admin"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-slate-200 text-slate-800 hover:bg-slate-300"
            }`}
          >
            Admin
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-4 max-w-6xl mx-auto w-full">
        {view === "booking" ? <BookingPage /> : <AdminPage />}
      </main>
    </div>
  );
};

export default App;

// ---------- Booking Page ----------

// ---------- Admin Page ----------
const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<
    "court" | "equipment" | "coach" | "pricing" | "coachAvailability"
  >("court");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <AdminTabButton
          label="Courts"
          value="court"
          tab={tab}
          setTab={setTab}
        />
        <AdminTabButton
          label="Equipment"
          value="equipment"
          tab={tab}
          setTab={setTab}
        />
        <AdminTabButton
          label="Coaches"
          value="coach"
          tab={tab}
          setTab={setTab}
        />
        <AdminTabButton
          label="Pricing Rules"
          value="pricing"
          tab={tab}
          setTab={setTab}
        />
        <AdminTabButton
          label="Coach Availability"
          value="coachAvailability"
          tab={tab}
          setTab={setTab}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm">
        {tab === "court" && <AdminCourtForm />}
        {tab === "equipment" && <AdminEquipmentForm />}
        {tab === "coach" && <AdminCoachForm />}
        {tab === "pricing" && <AdminPricingRuleForm />}
        {tab === "coachAvailability" && <AdminCoachAvailabilityForm />}
      </div>
    </div>
  );
};

type AdminTabKey =
  | "court"
  | "equipment"
  | "coach"
  | "pricing"
  | "coachAvailability";

const AdminTabButton: React.FC<{
  label: string;
  value: AdminTabKey;
  tab: AdminTabKey;
  setTab: (v: AdminTabKey) => void;
}> = ({ label, value, tab, setTab }) => (
  <button
    onClick={() => setTab(value)}
    className={`px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap font-medium transition ${
      tab === value
        ? "bg-sky-600 text-white shadow-sm"
        : "bg-slate-200 text-slate-800 hover:bg-slate-300"
    }`}
  >
    {label}
  </button>
);

// ----- Admin Forms -----

const AdminCourtForm: React.FC = () => {
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

const AdminEquipmentForm: React.FC = () => {
  const [name, setName] = useState("");
  const [totalQty, setTotalQty] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    setMsg("");
    if (!name || !totalQty || !pricePerUnit) {
      setMsg("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          totalQuantity: Number(totalQty),
          pricePerUnit: Number(pricePerUnit),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data.message || "Failed to create equipment");
      setMsg("Equipment created successfully.");
      setName("");
      setTotalQty("");
      setPricePerUnit("");
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
        Add Equipment
      </h2>
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
          <label className="mb-1 text-slate-700">Total Quantity</label>
          <input
            type="number"
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={totalQty}
            onChange={(e) => setTotalQty(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-slate-700">Price Per Unit (₹)</label>
          <input
            type="number"
            className="bg-white border border-slate-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs sm:text-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? "Saving..." : "Save Equipment"}
      </button>
      {msg && <p className="text-xs mt-1 text-slate-800">{msg}</p>}
    </div>
  );
};

const AdminCoachForm: React.FC = () => {
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

const AdminPricingRuleForm: React.FC = () => {
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

const AdminCoachAvailabilityForm: React.FC = () => {
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
