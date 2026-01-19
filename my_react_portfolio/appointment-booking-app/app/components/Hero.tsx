// app/components/Hero.tsx
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen bg-blue-600 text-white py-20 w-full">
      <div className="max-w-7xl mx-auto px-4  flex flex-col md:flex-row items-center md:justify-between">
        {/* left side */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to the Appointment Booking App
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Book your appointments with ease and convenience.
          </p>
          <Link
            href="/book-appointment"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-200"
          >
            Book Appointment
          </Link>
        </div>

        {/* right side-image */}
        <div className="mt-10 md:mt-0">
          <img
            src="/hero-image.avif"
            alt="Appointment Booking"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
