import Image from "next/image";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <main className=" min-h-screen ">
      <div className=" w-full">
        <Hero />
      </div>
    </main>
  );
}
