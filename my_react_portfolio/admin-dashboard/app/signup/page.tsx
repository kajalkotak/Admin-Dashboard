// app/signup/page.tsx

// app/signup/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      alert("Please fill all fields");
      return;
    }

    // 1️⃣ Create auth user
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (!data.user) return;

    // 2️⃣ Insert into members table
    const { error: memberError } = await supabase.from("members").insert([
      {
        user_id: data.user.id, // 🔥 VERY IMPORTANT
        name: cleanName,
        email: cleanEmail,
        role: "staff", // default
        status: 1,
      },
    ]);

    if (memberError) {
      console.error(memberError);
      alert("User created but member profile failed");
      return;
    }

    alert("Signup successful! Please verify email.");
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <p>Create an account to access the dashboard.</p>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={() => router.push("/login")}>Go to Login</button>
    </div>
  );
}
