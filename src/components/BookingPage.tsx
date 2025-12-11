import { useState } from "react";
import type { AvailabilityResponse, BookingResponse } from "../types/types";
import { API_BASE, formatForBackend } from "../helper";

export const BookingPage: React.FC = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(
    null
  );
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [equipmentQuantities, setEquipmentQuantities] = useState<
    Record<number, number>
  >({});
  const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(
    null
  );

  const handleCheckAvailability = async () => {
    setAvailability(null);
    setAvailabilityError("");
    setBookingResult(null);

    if (!startTime || !endTime) {
      setAvailabilityError("Please select start and end time.");
      return;
    }

    const start = formatForBackend(startTime);
    const end = formatForBackend(endTime);

    setLoadingAvailability(true);
    try {
      const url = `${API_BASE}/availability?startTime=${encodeURIComponent(
        start
      )}&endTime=${encodeURIComponent(end)}`;
      const res = await fetch(url);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch availability");
      }
      const data: AvailabilityResponse = await res.json();
      setAvailability(data);
      setSelectedCourtId(null);
      setSelectedCoachId(null);
      setEquipmentQuantities({});
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setAvailabilityError(err.message || "Something went wrong");
      }
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleEquipmentChange = (id: number, value: string) => {
    const qty = Number(value);
    setEquipmentQuantities((prev) => ({
      ...prev,
      [id]: Number.isNaN(qty) ? 0 : qty,
    }));
  };

  const handleCreateBooking = async () => {
    setBookingError("");
    setBookingResult(null);

    if (!startTime || !endTime) {
      setBookingError("Please select start and end time.");
      return;
    }

    if (!selectedCourtId) {
      setBookingError("Please select a court.");
      return;
    }

    const start = formatForBackend(startTime);
    const end = formatForBackend(endTime);

    const equipmentPayload = Object.entries(equipmentQuantities)
      .filter(([, qty]) => qty && qty > 0)
      .map(([id, qty]) => ({
        equipmentTypeId: Number(id),
        quantity: qty as number,
      }));

    const body = {
      userName: "Demo User", // later you can add form fields
      userEmail: "demo@example.com",
      startTime: start,
      endTime: end,
      courtId: selectedCourtId,
      equipment: equipmentPayload,
      coachId: selectedCoachId,
    };

    setBookingLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      setBookingResult(data as BookingResponse);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setBookingError(err.message || "Something went wrong");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-semibold">
          1. Select Time Slot
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col flex-1">
            <label className="text-xs sm:text-sm mb-1 text-slate-700">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-xs sm:text-sm mb-1 text-slate-700">
              End Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <button
            onClick={handleCheckAvailability}
            disabled={loadingAvailability}
            className="w-full md:w-auto md:self-end px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loadingAvailability ? "Checking..." : "Check Availability"}
          </button>
        </div>
        {availabilityError && (
          <p className="text-sm text-red-600">{availabilityError}</p>
        )}
      </section>

      {availability && (
        <>
          <section className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">
              2. Choose Court
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availability.courts.map((court) => (
                <button
                  key={court.id}
                  disabled={!court.isAvailable}
                  onClick={() => setSelectedCourtId(court.id)}
                  className={`border rounded-lg p-3 text-left text-sm bg-white transition shadow-sm ${
                    selectedCourtId === court.id
                      ? "border-sky-500 ring-1 ring-sky-300"
                      : "border-slate-200 hover:border-sky-300"
                  } ${
                    !court.isAvailable ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="font-medium text-slate-900">{court.name}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {court.isIndoor ? "Indoor" : "Outdoor"} • ₹
                    {court.baseHourlyRate}/hour
                  </div>
                  <div className="text-xs mt-2">
                    Status:{" "}
                    {court.isAvailable ? (
                      <span className="text-green-600 font-medium">
                        Available
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">Booked</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">
              3. Add Equipment
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availability.equipment.map((eq) => (
                <div
                  key={eq.id}
                  className="border border-slate-200 rounded-lg p-3 text-sm bg-white shadow-sm"
                >
                  <div className="font-medium text-slate-900">{eq.name}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    Price: ₹{eq.pricePerUnit} / unit
                  </div>
                  {eq.availableQuantity !== undefined && (
                    <div className="text-xs text-slate-600 mt-1">
                      Available: {eq.availableQuantity}
                    </div>
                  )}
                  <input
                    type="number"
                    min={0}
                    className="mt-2 w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={equipmentQuantities[eq.id] ?? 0}
                    onChange={(e) =>
                      handleEquipmentChange(eq.id, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">
              4. Choose Coach (optional)
            </h2>
            <div className="flex flex-wrap gap-3">
              {availability.coaches.map((coach) => (
                <button
                  key={coach.id}
                  disabled={!coach.isAvailable}
                  onClick={() => setSelectedCoachId(coach.id)}
                  className={`border rounded-lg p-3 text-left text-sm min-w-[160px] bg-white shadow-sm transition ${
                    selectedCoachId === coach.id
                      ? "border-sky-500 ring-1 ring-sky-300"
                      : "border-slate-200 hover:border-sky-300"
                  } ${
                    !coach.isAvailable ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="font-medium text-slate-900">{coach.name}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    ₹{coach.hourlyRate}/hour
                  </div>
                  <div className="text-xs mt-2">
                    Status:{" "}
                    {coach.isAvailable ? (
                      <span className="text-green-600 font-medium">
                        Available
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Unavailable
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">
              5. Confirm Booking
            </h2>
            {bookingError && (
              <p className="text-sm text-red-600">{bookingError}</p>
            )}
            <button
              onClick={handleCreateBooking}
              disabled={bookingLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {bookingLoading ? "Creating..." : "Create Booking"}
            </button>

            {bookingResult && (
              <div className="mt-4 border border-slate-200 rounded-lg p-3 text-sm bg-white shadow-sm">
                <div className="font-semibold mb-1 text-slate-900">
                  Booking Created (ID: {bookingResult.bookingId})
                </div>
                <div className="text-slate-800">
                  Total Price: ₹{bookingResult.totalPrice}
                </div>
                <div className="mt-3 text-xs text-slate-700 space-y-1">
                  <div>
                    Base Court: ₹{bookingResult.priceBreakdown.baseCourt}
                  </div>
                  <div>
                    Base Equipment: ₹
                    {bookingResult.priceBreakdown.baseEquipment}
                  </div>
                  <div>
                    Base Coach: ₹{bookingResult.priceBreakdown.baseCoach}
                  </div>
                  {bookingResult.priceBreakdown.adjustments.length > 0 && (
                    <>
                      <div className="mt-2 font-medium text-slate-900">
                        Adjustments:
                      </div>
                      <ul className="list-disc ml-4 space-y-0.5">
                        {bookingResult.priceBreakdown.adjustments.map((adj) => (
                          <li key={adj.ruleId}>
                            {adj.name} ({adj.appliesTo}) : ₹{adj.amount}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};
