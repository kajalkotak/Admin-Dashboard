"use client";

import { useEffect, useState } from "react";

/* =======================
   TYPE
======================= */
type Expense = {
  id: number;
  title: string;
  amount: number;
  category: "Food" | "Travel" | "Other";
  date: string;
};

export default function ExpenseInput() {
  /* =======================
     STATES
  ======================= */
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<"Food" | "Travel" | "Other">("Food");
  const [error, setError] = useState("");
  const [expenseList, setExpenseList] = useState<Expense[]>([]);

  /* =======================
     LOAD FROM LOCALSTORAGE
  ======================= */
  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) {
      setExpenseList(JSON.parse(saved));
    }
  }, []);

  /* =======================
     SAVE TO LOCALSTORAGE
  ======================= */
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenseList));
  }, [expenseList]);

  /* =======================
     ADD EXPENSE
  ======================= */
  function submitHandler(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !amount.trim()) {
      setError("Title and amount are required");
      return;
    }

    setExpenseList([
      ...expenseList,
      {
        id: Date.now(),
        title: title,
        amount: Number(amount),
        category: category,
        date: new Date().toISOString(),
      },
    ]);

    setTitle("");
    setAmount("");
    setCategory("Food");
    setError("");
  }

  /* =======================
     DELETE EXPENSE
  ======================= */
  function deleteHandler(id: number) {
    setExpenseList(expenseList.filter((item) => item.id !== id));
  }

  /* =======================
     MONTHLY TOTAL LOGIC
  ======================= */
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = expenseList.filter((item) => {
    const d = new Date(item.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthlyTotal =
    monthlyExpenses.length === 0
      ? 0
      : monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);

  // food total

  const foodTotal = monthlyExpenses
    .filter((e) => e.category === "Food")
    .reduce((sum, e) => sum + e.amount, 0);

  // Travel total

  const travelTotal = monthlyExpenses
    .filter((e) => e.category === "Travel")
    .reduce((sum, e) => sum + e.amount, 0);

  // other total

  const otherTotal = monthlyExpenses
    .filter((e) => e.category === "Other")
    .reduce((sum, e) => sum + e.amount, 0);

  /* =======================
     UI
  ======================= */
  return (
    <section className="w-full px-4">
      <div className="max-w-2xl mx-auto p-10 bg-orange-400 rounded-xl text-white">
        <h1 className="text-3xl font-bold mb-6">Expense Tracker</h1>

        {error && <p className="text-red-200 mb-4">{error}</p>}

        <form onSubmit={submitHandler} className="space-y-4">
          {/* TITLE */}
          <input
            type="text"
            value={title}
            placeholder="Expense Title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-md text-black"
          />

          {/* AMOUNT */}
          <input
            type="number"
            value={amount}
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-md text-black"
          />

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as "Food" | "Travel" | "Other")
            }
            className="w-full p-3 rounded-md text-black"
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="submit"
            className="bg-white text-orange-500 px-6 py-3 rounded-md font-semibold"
          >
            Add Expense
          </button>
        </form>

        {/* LIST */}
        <ul className="mt-8 space-y-3">
          {expenseList.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center bg-white text-black p-4 rounded-md"
            >
              <span>
                {item.title} - ₹{item.amount} ({item.category})
              </span>
              <button
                onClick={() => deleteHandler(item.id)}
                className="text-red-500 font-semibold"
              >
                Delete
              </button>
            </li>
          ))}

          <div className="mt-4 space-y-2">
            <p>🍔 Food: ₹{foodTotal}</p>
            <p>🚕 Travel: ₹{travelTotal}</p>
            <p>📦 Other: ₹{otherTotal}</p>
          </div>
        </ul>

        {/* MONTHLY TOTAL */}
        <p className="mt-6 text-xl font-semibold">
          This Month Total: ₹{monthlyTotal}
        </p>
      </div>
    </section>
  );
}
