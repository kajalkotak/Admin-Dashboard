// app/dashboard/layout.tsx

// app/dashboard/layout.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loggedInName, setLoggedInName] = useState("");
  const [loggedInEmail, setLoggedInEmail] = useState("");

  const [currentUserRole, setCurrentUserRole] = useState("");

  // ================= FETCH CURRENT USER ROLE =================
  useEffect(() => {
    const fetchUserRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const { data } = await supabase
          .from("members")
          .select("role")
          .eq("email", session.user.email)
          .maybeSingle();
        if (data?.role) {
          setCurrentUserRole(data.role);
        } else {
          setCurrentUserRole("staff"); // default role
        }
      }
    };

    fetchUserRole();
  }, []);
  // ================= AUTH CHECK & USER INFO =================

  // ✅ SINGLE STABLE EFFECT
  useEffect(() => {
    const init = async () => {
      // 1️⃣ auth check
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      // 2️⃣ email from auth
      const user = session.user;
      setLoggedInEmail(user.email ?? "");

      // 3️⃣ name from members table
      const { data } = await supabase
        .from("members")
        .select("name")
        .eq("email", user.email)
        .maybeSingle();

      if (data?.name) {
        setLoggedInName(data.name);
      }
    };

    init();
  }, []); // 👈 EMPTY dependency = STABLE

  // ---------------- UI (UNCHANGED) ----------------
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* TOP LEFT USER INFO */}

      {/* SIDEBAR */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#f0f0f0",
          padding: "20px",
        }}
      >
        <nav>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <a href="/dashboard">Dashboard Home</a>
            </li>
            <li>
              <a href="/dashboard/tasks">Tasks</a>
            </li>
            <li>
              <a href="/dashboard/members">Members</a>
            </li>
            <li>
              <a href="/dashboard/settings">Settings</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "20px" }}>
        <header
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Dashboard Header</h1>

          <div style={{ fontSize: "14px", color: "#555" }}>
            {loggedInName || loggedInEmail}

            <p className="text-sm text-gray-500 mb-2">
              Logged in as: <b>{currentUserRole.toUpperCase()}</b>
            </p>

            {/* logout button  */}
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.replace("/login");
              }}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <main style={{ padding: "16px" }}>{children}</main>
      </div>
    </div>
  );
}
