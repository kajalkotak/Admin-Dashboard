//
"use client";

import { useEffect, useState } from "react";

type Task = {
  _id: string;
  text: string;
  completed: boolean;
};

export default function InputField() {
  const [taskInput, setTaskInput] = useState("");
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  /* 🔹 Load tasks */
  useEffect(() => {
    fetch("http://localhost:3001/tasks")
      .then((res) => res.json())
      .then((data) => setTaskList(Array.isArray(data) ? data : []))
      .catch(() => setError("Server not reachable"));
  }, []);

  /* 🔹 Add task */
  function submitHandler(e: React.FormEvent) {
    e.preventDefault();

    if (!taskInput.trim()) {
      setError("Task cannot be empty");
      return;
    }

    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: taskInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTaskList(data);
        setTaskInput("");
        setError("");
      })
      .catch(() => setError("Failed to add task"));
  }

  /* 🔹 Toggle completed */
  function toggleHandler(id: string) {
    fetch(`http://localhost:3001/tasks/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => setTaskList(data));
  }

  /* 🔹 Delete task */
  function deleteHandler(id: string) {
    fetch(`http://localhost:3001/tasks/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => setTaskList(data));
  }

  /* 🔹 Filter logic */
  const filteredTasks = taskList.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <section className="w-full px-4">
      <div className="max-w-3xl mx-auto bg-orange-400 p-10 rounded-xl">
        <h1 className="text-4xl font-semibold text-white mb-6">Task Manager</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={submitHandler} className="flex gap-4 mb-6">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Enter task"
            className="flex-1 p-3 rounded-md outline-none"
          />
          <button className="bg-white text-orange-500 px-6 rounded-md font-semibold">
            Add
          </button>
        </form>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center bg-white p-4 rounded-md"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleHandler(task._id)}
                />
                <span
                  className={
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }
                >
                  {task.text}
                </span>
              </div>

              <button
                onClick={() => deleteHandler(task._id)}
                className="text-red-500 font-semibold"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
