// app/dashboard/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Task = {
  _id: string;

  task: string;

  dueDate: string;

  email: string;

  completed: boolean;
};

export default function Dashboard() {
  const router = useRouter();

  const [userName, setUserName] = useState("");

  const [userEmail, setUserEmail] = useState("");

  const [task, setTask] = useState("");

  const [dueDate, setDueDate] = useState("");

  const [tasks, setTasks] = useState<Task[]>([]);

  const [search, setSearch] = useState("");

  // LOAD USER

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      router.push("/login");

      return;
    }

    const name = localStorage.getItem("userName");

    const email = localStorage.getItem("userEmail");

    if (name) setUserName(name);

    if (email) {
      setUserEmail(email);

      loadTasks(email);
    }
  }, []);

  // LOAD TASKS

  async function loadTasks(email: string) {
    const res = await fetch("/api/tasks");

    const data = await res.json();

    const list = Array.isArray(data) ? data : [];

    const userTasks = list.filter((t: Task) => t.email === email);

    setTasks(userTasks);
  }

  // ADD TASK

  async function handleAddTask(e: any) {
    e.preventDefault();

    if (!task) return;

    await fetch("/api/tasks", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        task,

        dueDate,

        userEmail,
      }),
    });

    setTask("");

    setDueDate("");

    loadTasks(userEmail);
  }

  // DELETE

  async function handleDelete(id: string) {
    await fetch("/api/tasks", {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id,
      }),
    });

    loadTasks(userEmail);
  }

  // TOGGLE

  async function handleToggle(id: string, completed: boolean) {
    await fetch("/api/tasks", {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id,

        completed: !completed,
      }),
    });

    loadTasks(userEmail);
  }

  function handleLogout() {
    localStorage.clear();

    router.push("/login");
  }

  const filteredTasks = tasks.filter(
    (t) => t.task && t.task.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 p-5">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Dashboard</h1>

        <p className="text-center mb-4">
          Welcome
          <span className="font-bold"> {userName}</span>
        </p>

        {/* ADD */}

        <form onSubmit={handleAddTask} className="space-y-3">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Task"
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button className="w-full bg-blue-500 text-white p-2 rounded">
            Add Task
          </button>
        </form>

        {/* SEARCH */}

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded mt-4"
        />

        {/* LIST */}

        <div className="mt-4 space-y-2">
          {filteredTasks.map((t) => (
            <div
              key={t._id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <div>
                <input
                  type="checkbox"
                  checked={t.completed || false}
                  onChange={() => handleToggle(t._id, t.completed || false)}
                />

                <span className={`ml-2 ${t.completed ? "line-through" : ""}`}>
                  {t.task}
                </span>

                <div className="text-sm text-gray-500">{t.dueDate}</div>
              </div>

              <button
                onClick={() => handleDelete(t._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white p-2 rounded mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
