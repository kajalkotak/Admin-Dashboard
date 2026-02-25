// app/login/page.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Login Successful");

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);

      router.push("/dashboard");
    } else {
      alert(data.message);
    }
  }

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
      {/* Center area */}
      <div className="flex flex-1 justify-center items-center">
        {/* Form card */}
        <div className="w-full max-w-md border border-blue-400 rounded-xl p-8 bg-white dark:bg-zinc-900">
          <h2 className="text-2xl font-bold text-center text-red-400 mb-6">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-green-500 text-white font-semibold p-3 rounded-lg hover:bg-green-600 transition"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-500 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
