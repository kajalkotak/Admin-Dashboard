"use client";

import Image from "next/image";
import InputField from "./components/InputField";
import { useEffect } from "react";

export default function Home() {
  // useEffect(() => {
  //   fetch("http://localhost:3001/tasks")
  //     .then((res) => res.json())
  //     .then((data) => console.log(data));
  // });
  return (
    <div className="flex min-h-screen items-center justify-center  font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16  dark:bg-black sm:items-start">
        <InputField />
      </main>
    </div>
  );
}
