// page.tsx
import HomeComp from "../components/Home";
import Gallery from "../components/Gallery";
import About from "../components/About";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black font-sans">
      <main className="snap-container">
        <section id="home" className="snap-section">
          <HomeComp />
        </section>
        
        <section id="gallery" className="snap-section">
          <Gallery />
        </section>
          
        <section id="about" className="snap-section">
          <About />
        </section>
      </main>
    </div>
  );
}