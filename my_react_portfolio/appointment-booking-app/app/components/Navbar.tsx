// app/components/Navbar.tsx

"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [isloggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // check current session
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? null);
      
    });

    // listen for auth changes (login / logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user.email ?? null);
        
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <nav className="w-full bg-gray-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / App Name */}
        <h1 className="text-xl md:text-2xl font-bold">
          Appointment Booking App
        </h1>

        {/* hamburger menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {/* desktop navigation links */}

        {/* Navigation Links */}
        <div className="hidden md:block flex items-center space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          <Link href="/services" className="hover:underline">
            Services
          </Link>

          <Link
            href="/book-appointment"
            className="px-4 py-2 hover:underline bg-green-600 rounded hover:bg-green-700"
          >
            Book Appointment
          </Link>

          {!userEmail ? (
            <Link href="/login" className="bg-blue-600 px-4 py-2 rounded">
              Login
            </Link>
          ) : (
            <>
              <span className="text-sm text-gray-300">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      {/* // mobile navigation links */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 px-4 py-2 space-y-2">
          <Link href="/" className="block hover:underline">
            Home
          </Link>
          <Link href="/services" className="block hover:underline">
            Services
          </Link>
          <Link href="/book-appointment" className="block hover:underline">
            Book Appointment
          </Link>
          <Link
            href="/login"
            className="block hover:underline bg-blue-600 rounded hover:bg-blue-700 px-4 py-2"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
