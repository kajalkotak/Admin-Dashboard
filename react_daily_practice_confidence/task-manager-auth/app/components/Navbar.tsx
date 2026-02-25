// app/components/Navbar.tsx

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full  bg-zinc-50 font-sans dark:bg-black">
      <div className="max-w-7xl mx-auto flex justify-between items-center border-b border-black p-5">
        {/* left side */}
        <div>
          <h1 className="text-3xl font-bold text-red-400 text-center ">
            Task Manager
          </h1>
        </div>

        {/* right side */}
        <div>
          <Link
            href="/login"
            className="bg-green-400 font-xl font-semibold text-white p-3 mr-3 rounded-xl hover:bg-green-400"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-400 font-xl font-semibold text-white p-3 mr-3 rounded-xl hover:bg-blue-500"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
