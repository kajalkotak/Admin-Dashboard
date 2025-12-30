// app/dashboard/members/page.tsx

// app/dashboard/members/page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface Member {
  id: number;
  user_id: string;
  name: string;
  email: string;
  role: string;
  status: number; // 1 = Active, 0 = Inactive
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");

  // edit states
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editingMemberName, setEditingMemberName] = useState("");
  const [editingMemberEmail, setEditingMemberEmail] = useState("");
  const [editingMemberRole, setEditingMemberRole] = useState("staff");

  // search + filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // auth + role
  const [user, setUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<
    "admin" | "manager" | "staff"
  >("staff");

  const canEdit = currentUserRole === "admin" || currentUserRole === "manager";
  const canDelete = currentUserRole === "admin";
  const canToggleStatus = canEdit;

  const [roles, setRoles] = useState("staff");

  // ================= FETCH AUTH USER =================
  const fetchCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUser(user);
    fetchUserRole(user.id);
  };

  // ================= FETCH USER ROLE =================
  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("members")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle(); // ✅ IMPORTANT

    if (error) {
      console.error("Fetch user role error:", error);
      return;
    }

    if (!data) {
      console.warn("No member profile found");
      return;
    }

    setCurrentUserRole(data.role);
  };

  // ================= FETCH MEMBERS =================
  const fetchMembers = async () => {
    const { data, error } = await supabase.from("members").select("*");
    if (!error) setMembers(data || []);
  };

  useEffect(() => {
    fetchMembers();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // ================= ADD =================
  const addMember = async () => {
    if (!name.trim() || !email.trim()) return;

    const { error } = await supabase.from("members").insert([
      {
        name,
        email,
        role,
        status: 1,
      },
    ]);

    if (!error) {
      setName("");
      setEmail("");
      setRole("staff");
      fetchMembers();
    }
  };

  // ================= TOGGLE =================
  const toggleStatus = async (id: number, status: number) => {
    await supabase
      .from("members")
      .update({ status: status === 1 ? 0 : 1 })
      .eq("id", id);

    fetchMembers();
  };

  // ================= DELETE =================
  const deleteMember = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    await supabase.from("members").delete().eq("id", id);
    fetchMembers();
  };

  // ================= EDIT =================
  const startEdit = (m: Member) => {
    setEditingMemberId(m.id);
    setEditingMemberName(m.name);
    setEditingMemberEmail(m.email);
    setEditingMemberRole(m.role);
  };

  const saveEdit = async () => {
    if (!editingMemberId) return;

    await supabase
      .from("members")
      .update({
        name: editingMemberName,
        email: editingMemberEmail,
        role: editingMemberRole,
      })
      .eq("id", editingMemberId);

    setEditingMemberId(null);
    fetchMembers();
  };

  const cancelEdit = () => {
    setEditingMemberId(null);
  };

  // ================= FILTER + PAGINATION =================
  const filteredMembers = members.filter((m) => {
    const s =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());

    const f =
      statusFilter === "all" ||
      (statusFilter === "active" && m.status === 1) ||
      (statusFilter === "inactive" && m.status === 0);

    return s && f;
  });

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ---------------- UI ----------------

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Members</h1>
      <p className="mb-5 text-gray-600">Manage your team members here</p>

      {/* SEARCH AND FILTER
       */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border rounded px-3 py-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button
        onClick={() => setStatusFilter("all")}
        className="bg-gray-200 text-black px-4 py-2 rounded mr-2"
      >
        All
      </button>
      <button
        onClick={() => setStatusFilter("active")}
        className="bg-green-200 text-black px-4 py-2 rounded mr-2"
      >
        Active
      </button>
      <button
        onClick={() => setStatusFilter("inactive")}
        className="bg-red-200 text-black px-4 py-2 rounded mr-2"
      >
        Inactive
      </button>

      {/* ADD FORM */}
      <div className="mb-6 space-y-3 mt-5">
        <h1 className="text-xl font-semibold">Add Member</h1>
        <input
          type="text"
          placeholder="Name"
          className="border rounded px-3 py-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>

        <button
          onClick={addMember}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Member
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-2">
        Logged in as: <b>{currentUserRole.toUpperCase()}</b>
      </p>

      {/* TABLE */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedMembers.map((member) => (
            <tr key={member.id}>
              <td className="border px-4 py-2">
                {editingMemberId === member.id ? (
                  <input
                    value={editingMemberName}
                    onChange={(e) => setEditingMemberName(e.target.value)}
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  member.name
                )}
              </td>

              <td className="border px-4 py-2">
                {editingMemberId === member.id ? (
                  <input
                    value={editingMemberEmail}
                    onChange={(e) => setEditingMemberEmail(e.target.value)}
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  member.email
                )}
              </td>

              <td className="border px-4 py-2">
                {editingMemberId === member.id ? (
                  <select
                    value={editingMemberRole}
                    onChange={(e) => setEditingMemberRole(e.target.value)}
                    className="border px-2 py-1 w-full"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                ) : (
                  member.role
                )}
              </td>

              <td className="border px-4 py-2">
                {member.status === 1 ? "Active" : "Inactive"}
              </td>
              <td className="border px-4 py-2 space-x-2">
                {canToggleStatus && (
                  <button
                    onClick={() => toggleStatus(member.id, member.status)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    {member.status === 1 ? "Deactivate" : "Activate"}
                  </button>
                )}
                {editingMemberId === member.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-2 py-1 rounded ml-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  canEdit && (
                    <button
                      onClick={() => startEdit(member)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  )
                )}

                {canDelete && (
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of{" "}
          {Math.ceil(filteredMembers.length / itemsPerPage) || 1}
        </span>
        <button
          disabled={
            currentPage === Math.ceil(filteredMembers.length / itemsPerPage)
          }
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
