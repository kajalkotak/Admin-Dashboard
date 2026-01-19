// app/habits/page.tsx

"use client";

import HabitInput from "@/app/components/HabitInput";

export default function HabitsPage() {
  return (
    <section className="w-full px-4">
      <div className="max-w-7xl mx-auto px-4 bg-orange-400 p-20">
        <h1 className="text-4xl font-semibold text-white mb-6">
          Daily Habit Tracker
        </h1>

        <HabitInput />
      </div>
    </section>
  );
}
