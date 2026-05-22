import Image from "next/image";
import HomeComp from "../components/Home";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black font-sans">
      <main className="flex flex-1 w-full flex-col">
        <HomeComp />
      </main>
    </div>
  );
}
