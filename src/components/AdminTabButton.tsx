import type { AdminTabKey } from "../types/types";

export const AdminTabButton: React.FC<{
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
