// Gallery.tsx - Cleaner cards, larger size, work counter, touchpad support (no thumbnails)
"use client";

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Gallery.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────
export type GalleryItem = {
  id: string;
  category: "PHOTO MANIPLATION" | "UI/UX DESIGN" | "WEB DESIGN" | "ANIME GRAPHICS" | "CAR GRAPHICS" | "GAME GRAPHICS" | "BRANDING" | "FOOTBALL GRAPHICS";
  title: string;
  sub: string;
  description?: string;
  images: string[];
  accent: string;
  bg: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_LIST = [
  "PHOTO MANIPLATION",
  "UI/UX DESIGN", 
  "WEB DESIGN",
  "ANIME GRAPHICS",
  "CAR GRAPHICS",
  "GAME GRAPHICS",
  "BRANDING",
  "FOOTBALL GRAPHICS",
] as const;
type Category = (typeof CATEGORY_LIST)[number];

const CATEGORY_ICONS: Record<string, string> = {
  "PHOTO MANIPLATION": "✦",
  "PHOTO MANIPULATION": "✦",
  "UI/UX DESIGN": "⊡",
  "WEB DESIGN": "⊕",
  "ANIME GRAPHICS": "⛩",
  "CAR GRAPHICS": "◎",
  "GAME GRAPHICS": "⚔",
  BRANDING: "◈",
  "FOOTBALL GRAPHICS": "⬡",
};

const CATEGORY_ACCENTS: Record<string, string> = {
  "PHOTO MANIPLATION": "#c084fc",
  "PHOTO MANIPULATION": "#c084fc",
  "UI/UX DESIGN": "#38bdf8",
  "WEB DESIGN": "#34d399",
  "ANIME GRAPHICS": "#f472b6",
  "CAR GRAPHICS": "#fb923c",
  "GAME GRAPHICS": "#facc15",
  BRANDING: "#a78bfa",
  "FOOTBALL GRAPHICS": "#4ade80",
};

const CATEGORY_BGS: Record<string, string> = {
  "PHOTO MANIPLATION": "#1a0a2e",
  "PHOTO MANIPULATION": "#1a0a2e",
  "UI/UX DESIGN": "#0a1a2e",
  "WEB DESIGN": "#0a1e14",
  "ANIME GRAPHICS": "#1e0a1a",
  "CAR GRAPHICS": "#1e0e00",
  "GAME GRAPHICS": "#1a1400",
  BRANDING: "#12081e",
  "FOOTBALL GRAPHICS": "#0a1e0a",
};

// ─── Project factory ──────────────────────────────────────────────────────────
function proj(
  id: string,
  category: GalleryItem["category"],
  title: string,
  sub: string,
  description: string,
  images: string[]
): GalleryItem {
  return {
    id,
    category,
    title,
    sub,
    description,
    images,
    accent: CATEGORY_ACCENTS[category] ?? "#ffffff",
    bg: CATEGORY_BGS[category] ?? "#0a0a0a",
  };
}

// ─── Default projects ─────────────────────────────────────────────────────────
const DEFAULT_PROJECTS: GalleryItem[] = [
  proj("p1",  "PHOTO MANIPLATION",  "Baby Jellys", "Photo Manipulation & Digital Art", "My first ever work with Photoshop.", ["/Images/Baby jellys compressed.webp"]),
  proj("p2",  "FOOTBALL GRAPHICS",  "Reece James Poster", "Chelsea FC Player Poster", "A Match Day poster of Reece James.", ["/Images/Reeece James compressed.webp"]),
  proj("p3",  "FOOTBALL GRAPHICS",  "Antony Poster", "Real Betis Player Poster", "A graphic poster for Antony at Real Betis.", ["/Images/Antony poster psd-Smaller.webp"]),
  proj("p4",  "FOOTBALL GRAPHICS",  "Jude Bellingham Poster", "England Poster", "A graphic poster of Jude Bellingham.", ["/Images/Jude Poster-Second Version.webp"]),
  proj("p5",  "ANIME GRAPHICS",     "Sin Jin Woo Poster", "Solo Leveling Poster", "A graphic poster for Sin Jin Woo.", ["/Images/Sun jin woo poster 2.webp"]),
  proj("p6",  "ANIME GRAPHICS",     "Sun Suho Poster", "Solo Leveling Ragnarok Poster", "A graphic poster for Sun Suho.", ["/Images/Sung suho poster 2.webp"]),
  proj("p7",  "ANIME GRAPHICS",     "Burner Poster", "Burning Effect Poster", "A poster for the character Burner.", ["/Images/Burner poster compressed.webp"]),
  proj("p8",  "CAR GRAPHICS",       "Nissan Graphic Poster", "Nissan Car Poster", "A sleek graphic poster for the Nissan brand.", ["/Images/Nissan poster 2.webp"]),
  proj("p9",  "ANIME GRAPHICS",     "Kai De Anectode Poster", "Burning Effect Poster", "A poster for Kai De Anectode.", ["/Images/KAI poster compressed.webp"]),
  proj("p10", "ANIME GRAPHICS",     "Roy Poster", "Burning Effect Poster", "A poster for Roy.", ["/Images/Roy poster compressed.webp"]),
  proj("p11", "ANIME GRAPHICS",     "Great Poster", "Burning Effect Poster", "A poster for Great.", ["/Images/Great poster compressed.webp"]),
  proj("p12", "ANIME GRAPHICS",     "Luck Poster", "Black Clover Poster", "A poster for Luck.", ["/Images/Luck Poster.webp"]),
  proj("p13", "ANIME GRAPHICS",     "Zora Poster", "Black Clover Poster", "A poster for Zora.", ["/Images/Zora poster.webp"]),
  proj("p14", "ANIME GRAPHICS",     "Asta Poster", "Black Clover Poster", "A poster for Asta.", ["/Images/Asta poster 2.jpg"]),
  proj("p15", "ANIME GRAPHICS",     "Mereleona Vermillion Poster", "Black Clover Poster", "A poster for Mereleona Vermillion.", ["/Images/Vermillion Poster.webp"]),
  proj("p16", "ANIME GRAPHICS",     "Aizen Sosuke Poster", "Bleach Poster", "A poster for Aizen Sosuke.", ["/Images/Aizen Poster.webp"]),
  proj("p17", "ANIME GRAPHICS",     "Liebe Poster", "Black Clover Poster", "A poster for Liebe.", ["/Images/Liebe Poster.webp"]),
  proj("p18", "ANIME GRAPHICS",     "Asta Brutalism Poster", "Black Clover Poster", "A brutalism-style poster for Asta.", ["/Images/Asta brutalism poster Instagram.webp"]),
  proj("p19", "ANIME GRAPHICS",     "Han Ysalt Poster", "Pick Me Up Infinite Gacha", "A poster for Han Ysalt.", ["/Images/Han ysalt Poster-Smaller.webp"]),
  proj("p20", "ANIME GRAPHICS",     "Yvolka Rivela Poster", "Pick Me Up Infinite Gacha", "A poster for Yvolka Rivela.", ["/Images/yvolka poster.webp"]),
  proj("p21", "GAME GRAPHICS",      "Helldivers 2 Poster", "HELLDIVERS 2", "A propaganda poster for Helldivers 2.", ["/Images/Helldivers 2 propaganda poster 2 Complete.webp"]),
  proj("p22", "CAR GRAPHICS",       "Porsche Poster", "Porsche Car Poster", "A graphic poster for Porsche.", ["/Images/Porshce image compressed.webp"]),
  proj("p23", "BRANDING",           "Road House Poster", "ROAD HOUSE GUEST HOUSE", "A concept brand poster.", ["/Images/Guest-House Poster-2.webp"]),
  proj("p24", "BRANDING",           "Math Academy Poster", "Educational Brand Poster", "A poster for Math Academy.", ["/Images/MAth academy compressed.webp"]),
  proj("p25", "BRANDING",           "FessyNam Poster", "FessyNam IT Brand Poster", "A poster for FessyNam.", ["/Images/FessyNam compressed.webp"]),
  proj("p26", "BRANDING",           "Sono Ace Poster", "Sono Ace Audio Brand Poster", "A poster for Sono Ace headphones.", ["/Images/Sono Ace Poster.webp"]),
  proj("p27", "FOOTBALL GRAPHICS",  "Lewandowski Poster", "FC Bayern Poster", "A poster for Robert Lewandowski.", ["/Images/Robert lewandowski poster-smaller.webp"]),
  proj("p28", "FOOTBALL GRAPHICS",  "Zlatan Poster", "FC Barcelona Poster", "A poster for Zlatan Ibrahimovic.", ["/Images/Zlatan Poster.webp"]),
  proj("p29", "FOOTBALL GRAPHICS",  "Desire Doue Poster", "PSG Poster", "A poster for Desire Doue.", ["/Images/poster instagram.webp"]),
  proj("p30", "FOOTBALL GRAPHICS",  "Desire Doue Poster 2", "PSG Poster", "A second poster for Desire Doue.", ["/Images/Desire Doue poster 2.webp"]),
  proj("p31", "FOOTBALL GRAPHICS",  "Estevao Willian Poster", "Chelsea FC Poster", "A poster for Estevao Willian.", ["/Images/Estevao poster-New smaller.webp"]),
  proj("p32", "FOOTBALL GRAPHICS",  "Noni Madueke Poster", "Chelsea FC Poster", "A poster for Noni Madueke.", ["/Images/Noni madueke compressed.webp"]),
  proj("p33", "FOOTBALL GRAPHICS",  "Mohamed Salah Poster", "Liverpool FC Poster", "A poster for Mohamed Salah.", ["/Images/Salah poster-medium sized.webp"]),
  proj("p34", "FOOTBALL GRAPHICS",  "Neymar Jr Poster", "Santos FC Poster", "A poster for Neymar Jr.", ["/Images/Neymar Poster-Smaller.webp"]),
  proj("p35", "FOOTBALL GRAPHICS",  "Luis Suarez Poster", "FC Barcelona Poster", "A stats poster for Luis Suarez.", ["/Images/Luiz suarez poster-smaller.webp"]),
  proj("p36", "FOOTBALL GRAPHICS",  "Malo Gusto Poster", "Chelsea FC Poster", "A poster for Malo Gusto.", ["/Images/Malo gusto image compressed.webp"]),
];

// ─── Coverflow Math - LARGER CARDS ──────────────────────────────────────────
function getCoverflowTransform(offset: number, cardWidth: number) {
  const absOffset = Math.abs(offset);
  
  // Only show 2 cards on each side
  const MAX_VISIBLE = 2;
  
  if (absOffset > MAX_VISIBLE) {
    return {
      transform: `translateX(${offset > 0 ? 600 : -600}px) scale(0)`,
      opacity: 0,
      zIndex: 0,
      pointerEvents: "none" as const,
    };
  }
  
  const direction = Math.sign(offset);
  
  // Slightly tighter spacing for larger cards
  const SPACING = cardWidth * 0.85;
  const translateX = direction * absOffset * SPACING;
  
  // Gentle rotation for depth
  const MAX_ROTATION = 25;
  const rotation = direction * Math.min(absOffset * 12, MAX_ROTATION);
  
  // Scale: active full size, others smaller
  let scale = 1;
  if (absOffset === 1) scale = 0.75;
  else if (absOffset === 2) scale = 0.55;
  
  // Z-depth
  const translateZ = -absOffset * 35;
  
  // Opacity
  let opacity = 1;
  if (absOffset === 1) opacity = 0.75;
  else if (absOffset === 2) opacity = 0.45;
  
  const zIndex = 10 - absOffset;
  
  return {
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotation}deg) scale(${scale})`,
    opacity,
    zIndex,
    pointerEvents: "auto" as const,
  };
}

// ─── Main Gallery Component ───────────────────────────────────────────────────
interface Props {
  projects?: GalleryItem[];
}

export default function Gallery({ projects = DEFAULT_PROJECTS }: Props) {
  const [dropOpen, setDropOpen] = useState(false);
  const [selectedCats, setSelectedCats] = useState<Set<Category>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalProject, setModalProject] = useState<GalleryItem | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [cardWidth, setCardWidth] = useState(300);
  
  const stageRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveringRef = useRef(false);
  const isModalOpenRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  
  // Compute filtered list
  const filtered = selectedCats.size === 0
    ? projects
    : projects.filter((p) => selectedCats.has(p.category as Category));
  const totalItems = filtered.length;
  const currentPosition = activeIndex + 1;
  
  // Measure and set larger card width based on viewport
  useLayoutEffect(() => {
    function updateDimensions() {
      if (stageRef.current) {
        const stageWidth = stageRef.current.offsetWidth;
        // LARGER CARD SIZES
        let newWidth = Math.min(320, Math.max(220, stageWidth * 0.22));
        if (window.innerWidth < 768) newWidth = Math.min(240, stageWidth * 0.35);
        if (window.innerWidth < 480) newWidth = Math.min(200, stageWidth * 0.45);
        setCardWidth(newWidth);
      }
    }
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  
  useEffect(() => {
    setPortalReady(true);
  }, []);
  
  // Reset index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCats]);
  
  // Auto-advance carousel
  function startAuto() {
    stopAuto();
    autoRef.current = setInterval(() => {
      if (!isDraggingRef.current && !isHoveringRef.current && !isModalOpenRef.current && totalItems > 1) {
        setActiveIndex((prev) => (prev + 1) % totalItems);
      }
    }, 5000);
  }
  
  function stopAuto() {
    if (autoRef.current) {
      clearInterval(autoRef.current);
      autoRef.current = null;
    }
  }
  
  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [totalItems]);
  
  // Navigation functions
  const goToPrevious = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
    startAuto();
  }, [totalItems]);
  
  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
    startAuto();
  }, [totalItems]);
  
  const goToIndex = useCallback((index: number) => {
    setActiveIndex(index);
    startAuto();
  }, []);
  
  // Improved drag handlers for touchpad
  const handleDragStart = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    stopAuto();
    if (stageRef.current) {
      stageRef.current.style.cursor = "grabbing";
    }
  };
  
  const handleDragMove = useCallback((e: PointerEvent) => {
    if (!isDraggingRef.current) return;
    
    const delta = e.clientX - dragStartXRef.current;
    const absDelta = Math.abs(delta);
    const swipeThreshold = 30;
    
    if (absDelta > swipeThreshold) {
      isDraggingRef.current = false;
      
      if (delta > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
      
      if (stageRef.current) {
        stageRef.current.style.cursor = "";
      }
    }
  }, [goToPrevious, goToNext]);
  
  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    if (stageRef.current) {
      stageRef.current.style.cursor = "";
    }
    startAuto();
  }, []);
  
  useEffect(() => {
    window.addEventListener("pointermove", handleDragMove);
    window.addEventListener("pointerup", handleDragEnd);
    return () => {
      window.removeEventListener("pointermove", handleDragMove);
      window.removeEventListener("pointerup", handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpenRef.current) {
        if (e.key === "Escape") closeModal();
        return;
      }
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);
  
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  function openModal(project: GalleryItem) {
    isModalOpenRef.current = true;
    setModalProject(project);
    document.body.style.overflow = "hidden";
  }
  
  function closeModal() {
    isModalOpenRef.current = false;
    setModalProject(null);
    document.body.style.overflow = "";
  }
  
  function toggleCategory(cat: Category) {
    setSelectedCats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cat)) {
        newSet.delete(cat);
      } else {
        newSet.add(cat);
      }
      return newSet;
    });
  }
  
  const activeProject = filtered[activeIndex] ?? null;
  const cardHeight = cardWidth * 1.4;
  
  return (
    <section className={styles.gallerySection}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.dropWrap} ref={dropRef} data-no-drag="true">
          <button
            className={`${styles.catBtn} ${dropOpen ? styles.catBtnOpen : ""}`}
            onClick={() => setDropOpen((v) => !v)}
          >
            <span className={styles.catBtnIcon}>⊞</span>
            CATEGORIES
            <span className={styles.catBtnChevron}>{dropOpen ? "▲" : "▼"}</span>
            {selectedCats.size > 0 && (
              <span className={styles.catBadge}>{selectedCats.size}</span>
            )}
          </button>
          {dropOpen && (
            <div className={styles.dropdown}>
              <button
                className={`${styles.dropItem} ${selectedCats.size === 0 ? styles.dropItemActive : ""}`}
                onClick={() => {
                  setSelectedCats(new Set());
                  setDropOpen(false);
                }}
              >
                <span className={styles.dropIcon}>✦</span>ALL
                {selectedCats.size === 0 && <span className={styles.dropCheck}>✓</span>}
              </button>
              <div className={styles.dropDivider} />
              {CATEGORY_LIST.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.dropItem} ${selectedCats.has(cat) ? styles.dropItemActive : ""}`}
                  onClick={() => toggleCategory(cat)}
                >
                  <span className={styles.dropIcon}>{CATEGORY_ICONS[cat]}</span>
                  {cat}
                  {selectedCats.has(cat) && <span className={styles.dropCheck}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Work counter */}
        <div className={styles.workCounter}>
          <span className={styles.workCounterCurrent}>{currentPosition}</span>
          <span className={styles.workCounterSeparator}>/</span>
          <span className={styles.workCounterTotal}>{totalItems}</span>
          <span className={styles.workCounterLabel}>WORKS</span>
        </div>
      </div>
      
      {/* 3D Coverflow Stage - LARGER HEIGHT for bigger cards */}
      <div
        className={styles.stage}
        ref={stageRef}
        onPointerDown={handleDragStart}
        onMouseEnter={() => (isHoveringRef.current = true)}
        onMouseLeave={() => (isHoveringRef.current = false)}
      >
        {/* Ambient Glow */}
        {activeProject && (
          <div
            className={styles.ambientGlow}
            style={{ background: activeProject.accent }}
          />
        )}
        
        {/* Coverflow Track */}
        <div className={styles.coverflowTrack}>
          {filtered.map((project, idx) => {
            const offset = idx - activeIndex;
            const transform = getCoverflowTransform(offset, cardWidth);
            const isActive = offset === 0;
            
            return (
              <div
                key={project.id}
                className={`${styles.cfCard} ${isActive ? styles.cfCardActive : ""}`}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  marginLeft: -cardWidth / 2,
                  marginTop: -cardHeight / 2,
                  background: project.bg,
                  ...transform,
                }}
                onClick={() => {
                  if (isActive) {
                    openModal(project);
                  } else {
                    goToIndex(idx);
                  }
                }}
              >
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className={styles.cfCardImg}
                  draggable={false}
                />
                
                {/* Clean overlay - just a subtle gradient */}
                <div className={styles.cfCardOverlay} />
                
                {isActive && <div className={styles.shimmerRing} />}
                
                <div className={styles.cfCardReflection}>
                  <img
                    src={project.images[0]}
                    alt=""
                    className={styles.cfCardReflectionImg}
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <div className={styles.reflectionStrip} />
      </div>
      
      {/* Info Panel */}
      {activeProject && (
        <div className={styles.infoPanel}>
          <span
            className={styles.infoCat}
            style={{ color: activeProject.accent }}
          >
            {CATEGORY_ICONS[activeProject.category]} {activeProject.category}
          </span>
          <h2 className={styles.infoTitle}>{activeProject.title}</h2>
          <p className={styles.infoSub}>{activeProject.sub}</p>
        </div>
      )}
      
      {/* Dot Navigation */}
      <div className={styles.controls}>
        <button className={styles.navArrow} onClick={goToPrevious} aria-label="Previous">
          ←
        </button>
        <div className={styles.dots}>
          {filtered.slice(0, 12).map((project, idx) => (
            <button
              key={project.id}
              className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ""}`}
              onClick={() => goToIndex(idx)}
              aria-label={`Go to project ${idx + 1}`}
              style={idx === activeIndex ? { background: project.accent } : {}}
            />
          ))}
          {totalItems > 12 && <span className={styles.dotsMore}>⋯</span>}
        </div>
        <button className={styles.navArrow} onClick={goToNext} aria-label="Next">
          →
        </button>
      </div>
      
      <p className={styles.dragHint}>← SWIPE, DRAG, OR USE TOUCHPAD →</p>
      
      {/* Modal Portal */}
      {portalReady && modalProject && createPortal(
        <Modal project={modalProject} onClose={closeModal} />,
        document.body
      )}
    </section>
  );
}

// ─── Modal Component ──────────────────────────────────────────────────────────
function Modal({ project, onClose }: { project: GalleryItem; onClose: () => void }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  
  const updateImageIndex = useCallback(() => {
    if (stripRef.current) {
      const scrollLeft = stripRef.current.scrollLeft;
      const containerWidth = stripRef.current.clientWidth;
      const index = Math.round(scrollLeft / containerWidth);
      setCurrentImageIndex(Math.min(index, project.images.length - 1));
    }
  }, [project.images.length]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.active || !stripRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      stripRef.current.scrollLeft = dragRef.current.scrollLeft - dx;
      updateImageIndex();
    };
    
    const handleMouseUp = () => {
      dragRef.current.active = false;
    };
    
    const handleScroll = () => {
      updateImageIndex();
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    
    if (stripRef.current) {
      stripRef.current.addEventListener("scroll", handleScroll);
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (stripRef.current) {
        stripRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [updateImageIndex]);
  
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>
        
        <div className={styles.modalImgWrap}>
          <div
            className={styles.modalImgStrip}
            ref={stripRef}
            onMouseDown={(e) => {
              if (!stripRef.current) return;
              dragRef.current = {
                active: true,
                startX: e.clientX,
                scrollLeft: stripRef.current.scrollLeft,
              };
            }}
          >
            {project.images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`${project.title} - ${idx + 1}`}
                className={styles.modalImg}
                draggable={false}
              />
            ))}
          </div>
          {project.images.length > 1 && (
            <div className={styles.modalImageCounter}>
              {currentImageIndex + 1} / {project.images.length}
            </div>
          )}
        </div>
        
        <div className={styles.modalInfo}>
          <span className={styles.modalCategory} style={{ color: project.accent }}>
            {CATEGORY_ICONS[project.category]} {project.category}
          </span>
          <h2 className={styles.modalTitle}>{project.title}</h2>
          <p className={styles.modalSub}>{project.sub}</p>
          {project.description && (
            <p className={styles.modalDesc}>{project.description}</p>
          )}
          {project.images.length > 1 && (
            <p className={styles.modalSwipeHint}>← SWIPE TO EXPLORE MORE →</p>
          )}
        </div>
      </div>
    </div>
  );
}