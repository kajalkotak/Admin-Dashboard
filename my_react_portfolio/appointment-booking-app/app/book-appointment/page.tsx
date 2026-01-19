// app/book-appointment/page.tsx

// app/book-appointment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
// import router from "next/dist/shared/lib/router/router";

export default function BookAppointment() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isBookingComplete = selectedService && selectedDate && selectedTime;

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        alert("Please log in to book an appointment.");
        router.push("/login");
      } else {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>checking authentication</p>
      </div>
    );
  }

  function formatService(service: string) {
    if (service === "consultation") return "Consultation (30 mins)";
    if (service === "therapy") return "Therapy Session (60 mins)";
    if (service === "followup") return "Follow-up (15 mins)";
    return "";
  }

  // conform booking handler (to be implemented)

  async function handleConfirmBooking() {
    // logic to handle booking confirmation
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("USER:", user);

    if (!user) {
      alert("Please log in to book an appointment.");
      return;
    }

    const { error } = await supabase.from("appointments").insert([
      {
        user_id: user.id,
        service: formatService(selectedService),
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        status: "confirmed",
      },
    ]);

    if (error) {
      alert("Error booking appointment: " + error.message);
    } else {
      alert("Appointment booked successfully!");
    }

    router.push("/booking-success");
  }

  return (
    <section className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          Book an Appointment
        </h2>

        {/* STEP 1 */}
        <div className="mb-6 border rounded-lg p-4">
          <h3 className="font-semibold mb-3">1. Select Service</h3>
          <select
            className="w-full p-2 border rounded"
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              setSelectedDate("");
              setSelectedTime("");
            }}
          >
            <option value="">Select a service</option>
            <option value="consultation">Consultation — 30 mins — ₹50</option>
            <option value="therapy">Therapy Session — 60 mins — ₹120</option>
            <option value="followup">Follow-up — 15 mins — ₹30</option>
          </select>
        </div>

        {/* STEP 2 */}
        <div className="mb-6 border rounded-lg p-4">
          <h3 className="font-semibold mb-3">2. Select Date</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime("");
            }}
            disabled={!selectedService}
            className="w-full p-2 border rounded disabled:bg-gray-200"
          />
        </div>

        {/* STEP 3 */}
        <div className="mb-6 border rounded-lg p-4">
          <h3 className="font-semibold mb-3">3. Select Time</h3>
          <select
            className="w-full p-2 border rounded disabled:bg-gray-200"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={!selectedDate}
          >
            <option value="">Select a time</option>
            <option value="9:00 AM">9:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="2:00 PM">2:00 PM</option>
            <option value="3:00 PM">3:00 PM</option>
          </select>
        </div>

        {/* SUMMARY PREVIEW */}
        {isBookingComplete && (
          <div className="mb-6 border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">Booking Summary</h3>
            <p>
              <strong>Service:</strong> {formatService(selectedService)}
            </p>
            <p>
              <strong>Date:</strong> {selectedDate}
            </p>
            <p>
              <strong>Time:</strong> {selectedTime}
            </p>
          </div>
        )}

        {/* CONFIRM BUTTON */}
        <button
          disabled={!isBookingComplete}
          onClick={handleConfirmBooking}
          className="w-full py-3 text-white font-semibold rounded
          bg-blue-600 hover:bg-blue-700
          disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Confirm Booking
        </button>
      </div>
    </section>
  );
}
