// app/expenses/page.tsx

"use client";

import ExpenseInput from "./ExpenseInput";

export default function ExpensePage() {
  return (
    <section className="w-full px-4">
      <div className="max-w-7xl mx-auto px-4 bg-orange-400 p-20">
        <h1 className="text-4xl font-semibold text-white mb-6">
          Expense Tracker
        </h1>

        <ExpenseInput />
      </div>
    </section>
  );
}
