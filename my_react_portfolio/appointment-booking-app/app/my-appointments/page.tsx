// app/my-appointments/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

type Appointment = {
  id: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchAppointments() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: true });

      if (!error) {
        setAppointments(data || []);
      }

      setLoading(false);
    }

    fetchAppointments();
  }, [router]);

  // Cancel appointment
  async function cancelAppointment(id: string) {
    const confirmCancel = confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmCancel) return;

    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (!error) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "cancelled" } : appt
        )
      );
    }
  }

  // Save reschedule
  async function saveReschedule(id: string) {
    if (!newDate || !newTime) {
      alert("Please select date and time");
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .update({
        appointment_date: newDate,
        appointment_time: newTime,
      })
      .eq("id", id);

    if (!error) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id
            ? {
                ...appt,
                appointment_date: newDate,
                appointment_time: newTime,
              }
            : appt
        )
      );
      setRescheduleId(null);
      setNewDate("");
      setNewTime("");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">My Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-600">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div key={appt.id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{appt.service}</p>
                    <p className="text-sm text-gray-600">
                      {appt.appointment_date} at {appt.appointment_time}
                    </p>
                  </div>

                  <span
                    className={`text-sm px-3 py-1 rounded ${
                      appt.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                {appt.status === "confirmed" && (
                  <div className="mt-3 flex space-x-4">
                    <button
                      onClick={() => setRescheduleId(appt.id)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => cancelAppointment(appt.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Reschedule Form */}
                {rescheduleId === appt.id && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Select time</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                    </select>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => saveReschedule(appt.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setRescheduleId(null)}
                        className="text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
