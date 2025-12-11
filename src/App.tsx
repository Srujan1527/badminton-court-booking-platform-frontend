import React, { useState } from "react";
import { BookingPage } from "./components/BookingPage";
import { AdminPage } from "./components/AdminPage";

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
