"use client";

import { useState, useEffect } from "react";

type Habit = {
  id: number;
  name: string;
  completed: boolean;
};

export default function HabitInput() {
  const [habitInput, setHabitInput] = useState("");
  const [error, setError] = useState("");
  const [habitList, setHabitList] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [darkmode, setDarkMode] = useState(false);

  /* 🔹 Load habits from localStorage */
  useEffect(() => {
    const saved = localStorage.getItem("habits");
    if (saved) {
      setHabitList(JSON.parse(saved));
    }
  }, []);

  /* 🔹 Save habits to localStorage */
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habitList));
  }, [habitList]);

  function submitHandler(e: React.FormEvent) {
    e.preventDefault();

    if (!habitInput.trim()) {
      setError("Habit cannot be empty");
      return;
    }

    setHabitList([
      ...habitList,
      {
        id: Date.now(),
        name: habitInput,
        completed: false,
      },
    ]);

    setHabitInput("");
    setError("");
  }

  function deleteHandler(id: number) {
    setHabitList(habitList.filter((habit) => habit.id !== id));
  }

  function toggleHandler(id: number) {
    setHabitList(
      habitList.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  }

  // filter logic

  const filterHabits = habitList.filter((habit) => {
    if (filter === "completed") return habit.completed;
    if (filter === "pending") return !habit.completed;
    return true;
  });

  // progress

  const completedCount = habitList.filter((h) => h.completed).length;

  const progress =
    habitList.length === 0
      ? 0
      : Math.round((completedCount / habitList.length) * 100);

  // resest today

  function resetToday() {
    setHabitList(habitList.map((h) => ({ ...h, completed: false })));
  }

  return (
    <section
      className={darkmode ? "bg-black text-white" : "bg-orange-400 text-black"}
    >
      <div
        className={`max-w-2xl mx-auto p-10 rounded-xl ${
          darkmode ? "bg-gray-800" : "bg-orange-400"
        }`}
      >
        <button
          className="border rounded-xl p-3 mb-3"
          onClick={() => setDarkMode(!darkmode)}
        >
          {darkmode ? "Light Mode" : "Dark Mode"}
        </button>

        <h1 className="text-4xl font-semibold text-white mb-6">
          Daily Habit Tracker
        </h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={submitHandler} className="flex gap-4 mb-6">
          <input
            type="text"
            value={habitInput}
            onChange={(e) => setHabitInput(e.target.value)}
            placeholder="Add a habit"
            className="flex-1 p-3 rounded-md outline-none"
          />

          <button
            type="submit"
            className="bg-white text-orange-500 px-6 rounded-md font-semibold"
          >
            Add
          </button>
        </form>

        {habitList.length === 0 && (
          <p className="text-white text-lg">No habits added yet.</p>
        )}

        <div className="flex mb-5 mt-5">
          <button
            type="button"
            className="mr-4 border rounded-xl bg-blue-200 px-4"
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className="mr-4 border rounded-xl bg-blue-200 px-4"
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            type="button"
            className="mr-4 border rounded-xl bg-blue-200 px-4"
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
        </div>

        <div className="mt-5 mb-5">
          <p className="mb-2">Today Progress : {progress} %</p>

          <button onClick={resetToday}>Reset Today </button>
        </div>

        <ul className="space-y-4">
          {filterHabits.map((habit) => (
            <li
              key={habit.id}
              className="flex items-center justify-between bg-white p-4 rounded-md"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={habit.completed}
                  onChange={() => toggleHandler(habit.id)}
                />

                <span
                  className={`text-lg ${
                    habit.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {habit.name}
                </span>
              </div>

              <button
                onClick={() => deleteHandler(habit.id)}
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
