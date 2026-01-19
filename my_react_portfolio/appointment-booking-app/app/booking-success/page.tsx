// app/booking-success/page.tsx

"use client";

import Link from "next/link";

export default function BookingSuccess() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Appointment Booked Successfully 🎉
        </h2>

        <p className="text-gray-600 mb-6">
          Your appointment has been confirmed. You can view or manage it anytime
          from your appointments page.
        </p>

        <div className="flex flex-col space-y-3">
          <Link
            href="/my-appointments"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            View My Appointments
          </Link>

          <Link
            href="/book-appointment"
            className="border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
          >
            Book Another Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
