// app//dashboard/tasks/page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

interface Task {
  id: number;
  task: string;
  status: number;
  created_at: string;
}

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // edit
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");

  // search + filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // ---------------- FETCH ----------------
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("id");
    if (!error) setTasks(data || []);
  };

  // ---------------- ADD ----------------
  const addTask = async () => {
    if (!newTask.trim()) return;

    await supabase.from("tasks").insert([{ task: newTask, status: 0 }]);
    setNewTask("");
    fetchTasks();
  };

  // ---------------- TOGGLE ----------------
  const toggleStatus = async (id: number, status: number) => {
    await supabase
      .from("tasks")
      .update({ status: status === 0 ? 1 : 0 })
      .eq("id", id);

    fetchTasks();
  };

  // ---------------- DELETE ----------------
  const deleteTask = async (id: number) => {
    if (!confirm("Delete task?")) return;
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  };

  // ---------------- EDIT ----------------
  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.task);
  };

  const saveEdit = async () => {
    if (!editingTaskText.trim() || editingTaskId === null) return;

    await supabase
      .from("tasks")
      .update({ task: editingTaskText })
      .eq("id", editingTaskId);

    setEditingTaskId(null);
    setEditingTaskText("");
    fetchTasks();
  };

  // ---------------- FILTER ----------------
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.task
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && task.status === 0) ||
      (statusFilter === "completed" && task.status === 1);

    return matchesSearch && matchesStatus;
  });

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // reset page on filter/search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // ---------------- UI ----------------
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>

      {/* Search */}
      <input
        className="w-full border px-3 py-2 mb-4"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Status filter */}
      <div className="flex gap-2 mb-4">
        {["all", "pending", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as any)}
            className={`px-3 py-1 border rounded ${
              statusFilter === s ? "bg-blue-600 text-white" : ""
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Add */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border px-3 py-2"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add task..."
        />
        <button onClick={addTask} className="bg-blue-600 text-white px-4">
          Add
        </button>
      </div>

      {/* List */}
      <ul className="bg-white shadow rounded">
        {paginatedTasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-3 border-b"
          >
            <div>
              {editingTaskId === task.id ? (
                <input
                  value={editingTaskText}
                  onChange={(e) => setEditingTaskText(e.target.value)}
                  className="border px-2 py-1"
                />
              ) : (
                <p
                  className={`font-medium ${
                    task.status === 1 ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.task}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              {editingTaskId === task.id ? (
                <>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => toggleStatus(task.id, task.status)}>
                    {task.status === 0 ? "Done" : "Undo"}
                  </button>
                  <button onClick={() => startEdit(task)}>Edit</button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* logout button */}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
