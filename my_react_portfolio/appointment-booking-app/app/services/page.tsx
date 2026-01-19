// app/services/page.tsx
import Image from "next/image";
import { services } from "@/app/data/services";
import Link from "next/link";

export default function Services() {
  return (
    <section className="min-h-screen  bg-gray-100 px-5 w-full p-5 text-center">
      <div className="max-w-7xl mx-auto text-center px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
      </div>

      {/* services card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:scale-105 transition-transform"
          >
            <img
              src={service.image}
              alt={service.name}
              className="w-32 h-32 object-cover mb-4 rounded-full"
            />
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <p className="text-gray-800 mb-4">{service.duration} minutes</p>
            <span className="text-green-600 font-bold text-lg">
              ${service.price}
            </span>
            <Link
              href="/book-appointment"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Book Appointment
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
