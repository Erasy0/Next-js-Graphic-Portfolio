// page.tsx
import HomeComp from "../components/Home";
import Gallery from "../components/Gallery";
import About from "../components/About";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black font-sans">
      <main className="snap-container">
        
          <HomeComp />
        
        
          <Gallery />
        
        
          <About />
        
      </main>
    </div>
  );
}