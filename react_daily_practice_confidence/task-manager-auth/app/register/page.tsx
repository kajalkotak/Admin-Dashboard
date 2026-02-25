// app/register/page.tsx

"use client";

import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("User Registered Successfully ✅");

        setName("");
        setEmail("");
        setPassword("");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
      <div className="flex flex-1 justify-center items-center">
        <div className="w-full max-w-md border border-blue-400 rounded-xl p-8 bg-white dark:bg-zinc-900">
          <h2 className="text-2xl font-bold text-center text-red-400 mb-6">
            Register
          </h2>

          <form onSubmit={handleRegister} className="space-y-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg p-3"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-3"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg p-3"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white font-semibold p-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-6">
            Already have account?{" "}
            <Link
              href="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
