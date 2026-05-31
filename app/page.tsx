// page.tsx
import HomeComp from "../components/Home";
import Gallery from "../components/Gallery";

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
      </main>
    </div>
  );
}