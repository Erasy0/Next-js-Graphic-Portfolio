// Gallery.tsx - Mobile-responsive coverflow gallery
"use client";

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Gallery.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────
export type GalleryItem = {
  id: string;
  category: "PHOTO MANIPLATION" | "UI/UX DESIGN" |  "ANIME GRAPHICS" | "CAR GRAPHICS" | "GAME GRAPHICS" | "BRANDING" | "FOOTBALL GRAPHICS";
  title: string;
  sub: string;
  description?: string;
  images: string[];
  accent: string;
  bg: string;
  /** Optional external link (e.g. a live website) shown as a button in the modal */
  link?: string;
  /** Show a "not built for mobile" notice next to the link in the modal */
  mobileWarning?: boolean;
  /** Rough "how dense/dramatic does this piece feel" tag used by the curated
   *  ordering algorithm below — a manual estimate, not a real image analysis. */
  visualWeight?: "heavy" | "light";
  /** Rough dominant-color tag used to avoid placing near-identical palettes
   *  back-to-back — also a manual estimate. */
  dominantColor?: string;
  /** Marks a standout piece the ordering algorithm can use as a "hook",
   *  mid-gallery highlight, or "finale" anchor. */
  featured?: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_LIST = [
  "PHOTO MANIPLATION",
  "UI/UX DESIGN",
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
  images: string[],
  extra?: {
    link?: string;
    mobileWarning?: boolean;
    visualWeight?: "heavy" | "light";
    dominantColor?: string;
    featured?: boolean;
  }
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
    link: extra?.link,
    mobileWarning: extra?.mobileWarning,
    visualWeight: extra?.visualWeight ?? "light",
    dominantColor: extra?.dominantColor ?? "#888888",
    featured: extra?.featured ?? false,
  };
}

// ─── Default projects ─────────────────────────────────────────────────────────
// ─── Default projects ─────────────────────────────────────────────────────────
// Metadata (visualWeight / dominantColor / featured) is a manual best-guess
// estimate based on category + subject matter — not a real image analysis.
// Adjust any tag directly here if it doesn't match the actual artwork; the
// ordering algorithm below just consumes whatever is tagged.
const DEFAULT_PROJECTS: GalleryItem[] = [
  proj("p1",  "PHOTO MANIPLATION",  "Baby Jellys", "Photo Manipulation & Digital Art", "My first ever work with Photoshop.", ["/Images/Baby jellys compressed.webp"], { visualWeight: "light", dominantColor: "blue", featured: true }),
  proj("p2",  "FOOTBALL GRAPHICS",  "Reece James Poster", "Chelsea FC ", "A Match Day poster of Reece James for Chelsea FC.", ["/Images/Reece-james-compressed-2.webp"], { visualWeight: "heavy", dominantColor: "blue" }),
  proj("p3",  "FOOTBALL GRAPHICS",  "Antony Poster", "Real Betis ", "A graphic poster for Antony at Real Betis.", ["/Images/Antony poster psd-Smaller.webp"], { visualWeight: "heavy", dominantColor: "green" }),
  proj("p4",  "FOOTBALL GRAPHICS",  "Jude Bellingham Poster", "England ", "A graphic poster of Jude Bellingham.", ["/Images/Jude Poster-Second Version.webp"], { visualWeight: "heavy", dominantColor: "white", featured: true }),
  proj("p5",  "ANIME GRAPHICS",     "Sin Jin Woo Poster", "Solo Leveling", "A graphic poster for Sin Jin Woo from the Korean comic Solo Leveling.", ["/Images/Sun jin woo poster 2.webp"], { visualWeight: "heavy", dominantColor: "purple" }),
  proj("p6",  "ANIME GRAPHICS",     "Sun Suho Poster", "Solo Leveling Ragnarok", "A graphic poster for Sun Suho from the Korean comic Solo Leveling Ragnarok.", ["/Images/Sung suho poster 2.webp"], { visualWeight: "heavy", dominantColor: "black" }),
  proj("p7",  "ANIME GRAPHICS",     "Burner Poster", "Burning Effect", "A poster for the character Burner from the Korean comic Burning Effect.", ["/Images/Burner poster compressed.webp"], { visualWeight: "heavy", dominantColor: "orange" }),
  proj("p8",  "CAR GRAPHICS",       "Nissan Graphic Poster", "Nissan", "A sleek graphic poster for the Nissan brand.", ["/Images/Nissan poster 2.webp"], { visualWeight: "light", dominantColor: "red", featured: true }),
  proj("p9",  "ANIME GRAPHICS",     "Kai De Anectode Poster", "Burning Effect", "A poster for Kai De Anectode from the Korean comic Burning Effect.", ["/Images/KAI poster compressed.webp"], { visualWeight: "heavy", dominantColor: "black" }),
  proj("p10", "ANIME GRAPHICS",     "Roy Poster", "Burning Effect", "A poster for Roy from the Korean comic Burning Effect.", ["/Images/Roy poster compressed.webp"], { visualWeight: "heavy", dominantColor: "purple" }),
  proj("p11", "ANIME GRAPHICS",     "Great Poster", "Burning Effect", "A poster for Great from the Korean comic Burning Effect.", ["/Images/Great poster compressed.webp"], { visualWeight: "heavy", dominantColor: "black" }),
  proj("p12", "ANIME GRAPHICS",     "Luck Poster", "Black Clover", "A poster for Luck from the Anime Black Clover.", ["/Images/Luck Poster.webp"], { visualWeight: "light", dominantColor: "yellow" }),
  proj("p13", "ANIME GRAPHICS",     "Zora Poster", "Black Clover", "A poster for Zora from the Anime Black Clover.", ["/Images/Zora poster.webp"], { visualWeight: "heavy", dominantColor: "green" }),
  proj("p14", "ANIME GRAPHICS",     "Asta Poster", "Black Clover", "A poster for Asta from the Anime Black Clover.", ["/Images/Asta poster 2.jpg"], { visualWeight: "heavy", dominantColor: "black", featured: true }),
  proj("p15", "ANIME GRAPHICS",     "Mereleona Vermillion Poster", "Black Clover", "A poster for Mereleona Vermillion from the Anime Black Clover.", ["/Images/Vermillion Poster.webp"], { visualWeight: "heavy", dominantColor: "red" }),
  proj("p16", "ANIME GRAPHICS",     "Aizen Sosuke Poster", "Bleach", "A poster for Aizen Sosuke from the Anime Bleach.", ["/Images/Aizen Poster.webp"], { visualWeight: "heavy", dominantColor: "purple", featured: true }),
  proj("p17", "ANIME GRAPHICS",     "Liebe Poster", "Black Clover", "A poster for Liebe from the Anime Black Clover.", ["/Images/Liebe Poster.webp"], { visualWeight: "heavy", dominantColor: "purple" }),
  proj("p18", "ANIME GRAPHICS",     "Asta Brutalism Poster", "Black Clover", "A brutalism-style poster for Asta from the Anime Black Clover.", ["/Images/Asta brutalism poster Instagram.webp"], { visualWeight: "heavy", dominantColor: "black" }),
  proj("p19", "ANIME GRAPHICS",     "Han Ysalt Poster", "Pick Me Up Infinite Gacha", "A poster for Han Ysalt from the Korean comic Pick Me Up Infinite Gacha.", ["/Images/Han ysalt Poster-Smaller.webp"], { visualWeight: "light", dominantColor: "blue" }),
  proj("p20", "ANIME GRAPHICS",     "Yvolka Rivela Poster", "Pick Me Up Infinite Gacha", "A poster for Yvolka Rivela from the Korean comic Pick Me Up Infinite Gacha.", ["/Images/yvolka poster.webp"], { visualWeight: "light", dominantColor: "pink" }),
  proj("p21", "GAME GRAPHICS",      "Helldivers 2 Poster", "HELLDIVERS 2", "A propaganda poster for Helldivers 2.", ["/Images/Helldivers 2 propaganda poster 2 Complete.webp"], { visualWeight: "heavy", dominantColor: "yellow", featured: true }),
  proj("p22", "CAR GRAPHICS",       "Porsche Poster", "Porsche", "A graphic poster for Porsche.", ["/Images/Porshce image compressed.webp"], { visualWeight: "light", dominantColor: "gray", featured: true }),
  proj("p23", "BRANDING",           "Road House Poster", "ROAD HOUSE GUEST HOUSE", "A concept brand poster.", ["/Images/Guest-House Poster-2.webp"], { visualWeight: "light", dominantColor: "brown", featured: true }),
  proj("p24", "BRANDING",           "Math Academy Poster", "Educational Brand Poster", "A poster for Math Academy.", ["/Images/MAth academy compressed.webp"], { visualWeight: "light", dominantColor: "teal" }),
  proj("p25", "BRANDING",           "FessyNam Poster", "FessyNam IT Brand Poster", "A poster for FessyNam.", ["/Images/FessyNam compressed.webp"], { visualWeight: "light", dominantColor: "blue" }),
  proj("p26", "BRANDING",           "Sono Ace Poster", "Sono Ace Audio", "A poster for Sono Ace headphones.", ["/Images/Sono Ace Poster.webp"], { visualWeight: "light", dominantColor: "black" }),
  proj("p27", "FOOTBALL GRAPHICS",  "Lewandowski Poster", "FC Bayern ", "A poster for Robert Lewandowski showcasing his stats for FC Bayern.", ["/Images/Robert lewandowski poster-smaller.webp"], { visualWeight: "heavy", dominantColor: "red" }),
  proj("p28", "FOOTBALL GRAPHICS",  "Zlatan Poster", "FC Barcelona ", "A poster for Zlatan Ibrahimovic for his time at FC Barcelona.", ["/Images/Zlatan Poster.webp"], { visualWeight: "heavy", dominantColor: "maroon" }),
  proj("p29", "FOOTBALL GRAPHICS",  "Desire Doue Poster", "PSG Poster", "A poster for Desire Doue.", ["/Images/poster instagram.webp"], { visualWeight: "light", dominantColor: "blue" }),
  proj("p30", "FOOTBALL GRAPHICS",  "Desire Doue Poster 2", "Paris Saint-Germain ", "A second poster for Desire Doue.", ["/Images/Desire Doue poster 2.webp"], { visualWeight: "heavy", dominantColor: "red", featured: true }),
  proj("p31", "FOOTBALL GRAPHICS",  "Estevao Willian Poster", "Chelsea FC ", "A Matchday Poster for Estevao Willian.", ["/Images/Estevao poster-New smaller.webp"], { visualWeight: "heavy", dominantColor: "blue" }),
  proj("p32", "FOOTBALL GRAPHICS",  "Noni Madueke Poster", "Chelsea FC ", "A Matchday Poster for Noni Madueke.", ["/Images/Noni madueke compressed.webp"], { visualWeight: "heavy", dominantColor: "blue" }),
  proj("p33", "FOOTBALL GRAPHICS",  "Mohamed Salah Poster", "Liverpool FC", "A poster for Mohamed Salah showcasing his stats for Liverpool FC.", ["/Images/Salah poster-medium sized.webp"], { visualWeight: "heavy", dominantColor: "red", featured: true }),
  proj("p34", "FOOTBALL GRAPHICS",  "Neymar Jr Poster", "Santos FC", "A graphic poster for Neymar Jr showing all the clubs he has played for.", ["/Images/Neymar Poster-Smaller.webp"], { visualWeight: "heavy", dominantColor: "white" }),
  proj("p35", "FOOTBALL GRAPHICS",  "Luis Suarez Poster", "FC Barcelona", "A stats poster for Luis Suarez.", ["/Images/Luiz suarez poster-smaller.webp"], { visualWeight: "heavy", dominantColor: "maroon" }),
  proj("p36", "FOOTBALL GRAPHICS",  "Malo Gusto Poster", "Chelsea FC", "A graphic poster for Malo Gusto showcasing his stats for Chelsea FC.", ["/Images/Malo gusto image compressed.webp"], { visualWeight: "heavy", dominantColor: "blue" }),
  proj("p37", "FOOTBALL GRAPHICS",  "Portugal 2026 Graphic Poster", "Portugal FA", "A graphic poster for the Portugal 2026 World Cup. squad", ["/Images/Cristiano ronaldo Portugal poster.webp"], { visualWeight: "heavy", dominantColor: "red" }),
  proj("p38", "BRANDING",  "Namibian enlistment war time concept Poster", "Namibai", "A graphic poster for the Namibian enlistment war time concept.", ["/Images/Namibian Propaganda poster-3.webp"], { visualWeight: "heavy", dominantColor: "brown" }),
  proj("p39", "FOOTBALL GRAPHICS",  "Nico Paz Football graphic Poster", "Argentina FA", "A graphic poster for Nico Paz Spanish born footballer player and choosed Argentina to represent.", ["/Images/Nico-paz-poster-2.webp"], { visualWeight: "heavy", dominantColor: "gray", featured: true }),
  proj("p40", "UI/UX DESIGN",  "Green Hydrogen Analytics Post Analysis", "Green Hydrogen Analytics Post", "A poster for analyzing a post about green hydrogen.", ["/Images/Green Hydrogen UIUX Design.webp"], { visualWeight: "light", dominantColor: "green", featured: true }),
  proj("p41", "ANIME GRAPHICS",  "Drian Poster ", "Burning effect", "A poster for Drian from the Korean manhwa` burning effect.", ["/Images/Drian Poster.webp"], { visualWeight: "heavy", dominantColor: "black", featured: true }),
   proj("p42", "BRANDING",  "Datalani Technology Logo ", "Datalani Technology", "A logo design for Datalani Technology.", ["/Images/FessyNam Logo.webp"], { visualWeight: "heavy", dominantColor: "blue", featured: true }),
    proj("p43", "UI/UX DESIGN",  "Erastus Shindinge Portfolio Home Page 2024 Design", "Erastus Shindinge", "A portfolio design for Erastus Shindinge portfolio 2024.", ["/Images/Erastus 2024 Portfolio.webp"], { visualWeight: "heavy", dominantColor: "black", featured: true }),
     proj("p44", "UI/UX DESIGN",  "Urban Sweep Route Management Page Design ", "Urban Sweep", "A design for Urban Sweep route management page.", ["/Images/Urban Sweep Route Management page.webp"], { visualWeight: "heavy", dominantColor: "white", featured: true }),
      proj("p45", "PHOTO MANIPLATION",  "EYES SKY", "Photo Manipulation", "A design for a photo manipulation piece eyes in the sky before AI.", ["/Images/eyes sky compressed-2.webp"], { visualWeight: "heavy", dominantColor: "purpule", featured: true }),
       proj("p46", "PHOTO MANIPLATION",  "Erastus Glass window rain ", "Photo Manipulation", "A design for a photo manipulation for erastus before AI.", ["/Images/Erasy photo manipulation-2.webp"], { visualWeight: "heavy", dominantColor: "black", featured: true }),
       proj("p47",  "ANIME GRAPHICS",     "Sin Jin Woo Poster 2", "Solo Leveling", "A graphic poster for Sin Jin Woo from the Korean manhwa Solo Levelin.", ["/Images/Sun jin woo poster 2-Smaller size.webp"], { visualWeight: "heavy", dominantColor: "purple" }),
     
];

// ─── Smart Curated Ordering ────────────────────────────────────────────────────
// Builds an "exhibition flow" automatically from each project's metadata, so
// adding new work later only means tagging it — not manually re-shuffling
// dozens of array entries. The pass:
//   1. Opens on a featured piece (in source order) — an immediate "hook".
//   2. Closes on a different-category featured piece — an intentional finale.
//   3. Greedily orders everything else to avoid repeating the same category,
//      dominant color, or visual weight back-to-back, while gently
//      resurfacing the remaining featured pieces through the middle third.
function buildSmartOrder(items: GalleryItem[]): GalleryItem[] {
  if (items.length <= 2) return [...items];

  const remaining = [...items];
  const takeAt = (idx: number) => remaining.splice(idx, 1)[0];

  const openerIdx = remaining.findIndex((p) => p.featured);
  const opener = takeAt(openerIdx === -1 ? 0 : openerIdx);

  let finale: GalleryItem | null = null;
  for (let i = remaining.length - 1; i >= 0; i--) {
    if (remaining[i].featured && remaining[i].category !== opener.category) {
      finale = takeAt(i);
      break;
    }
  }

  function friction(prev: GalleryItem, candidate: GalleryItem, recentCats: string[]) {
    let score = 0;
    if (candidate.category === prev.category) score += 6;
    if (candidate.dominantColor && candidate.dominantColor === prev.dominantColor) score += 3;
    if (candidate.visualWeight === prev.visualWeight) score += 1;
    score += recentCats.filter((c) => c === candidate.category).length * 2;
    return score;
  }

  const ordered: GalleryItem[] = [opener];
  const recentCats: string[] = [opener.category as string];

  while (remaining.length) {
    const prev = ordered[ordered.length - 1];
    const posRatio = ordered.length / (items.length || 1);
    let bestIdx = 0;
    let bestScore = Infinity;

    remaining.forEach((candidate, i) => {
      let score = friction(prev, candidate, recentCats.slice(-3));
      // Gently resurface remaining featured pieces through the middle third —
      // this is where a visitor is deciding whether to keep scrolling.
      if (candidate.featured && posRatio > 0.25 && posRatio < 0.75) score -= 1;
      if (score < bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    });

    const next = takeAt(bestIdx);
    ordered.push(next);
    recentCats.push(next.category as string);
  }

  if (finale) ordered.push(finale);
  return ordered;
}

// Computed once at module load — deterministic, so it won't reshuffle on
// every render or every visit.
const CURATED_PROJECTS: GalleryItem[] = buildSmartOrder(DEFAULT_PROJECTS);


// ─── Coverflow Math ──────────────────────────────────────────────────────────
function getCoverflowTransform(offset: number, cardWidth: number, isMobile: boolean) {
  const absOffset = Math.abs(offset);
  const MAX_VISIBLE = isMobile ? 1 : 2;

  if (absOffset > MAX_VISIBLE) {
    return {
      transform: `translateX(${offset > 0 ? 600 : -600}px) scale(0)`,
      opacity: 0,
      dim: 0,
      zIndex: 0,
      pointerEvents: "none" as const,
    };
  }

  if (isMobile) {
    const translateX = offset * cardWidth * 0.9;
    const scale = absOffset === 0 ? 1 : 0.84;
    const dim = absOffset === 0 ? 0 : 0.45;

    return {
      transform: `translate3d(${translateX}px, 0, 0) scale(${scale})`,
      opacity: 1,
      dim,
      zIndex: absOffset === 0 ? 20 : 10,
      pointerEvents: absOffset === 0 ? "auto" as const : "none" as const,
    };
  }

  const direction = Math.sign(offset);
  const SPACING = cardWidth * 0.85;
  const translateX = direction * absOffset * SPACING;
  const MAX_ROTATION = 25;
  const rotation = direction * Math.min(absOffset * 12, MAX_ROTATION);

  let scale = 1;
  if (absOffset === 1) scale = 0.86;
  else if (absOffset === 2) scale = 0.72;

  const translateZ = -absOffset * 60;

  let dim = 0;
  if (absOffset === 1) dim = 0.35;
  else if (absOffset === 2) dim = 0.65;

  const zIndex = 10 - absOffset;

  return {
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotation}deg) scale(${scale})`,
    opacity: 1,
    dim,
    zIndex,
    pointerEvents: "auto" as const,
  };
}

// ─── Blur-up image load tracking ──────────────────────────────────────────────
// Tracks real image load state so cards/modal images can blur while loading
// and sharpen in once the browser actually has the bytes, instead of either
// popping in instantly or sitting on a flat background color.
// useLayoutEffect (not useEffect) matters here: for already-cached images
// (revisiting a card, or images the existing preloader already fetched),
// this resolves before paint, so there's no one-frame flash of blur.
function useImageLoaded(src: string) {
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    let cancelled = false;
    setLoaded(false);

    const img = new window.Image();
    img.onload = () => {
      if (!cancelled) setLoaded(true);
    };
    img.src = src;

    // Already in browser cache — resolves synchronously, no blur flash.
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }

    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, [src]);

  return loaded;
}

// ─── Main Gallery Component ───────────────────────────────────────────────────
interface Props {
  projects?: GalleryItem[];
}

export default function Gallery({ projects = CURATED_PROJECTS }: Props) {
  const [dropOpen, setDropOpen] = useState(false);
  const [selectedCats, setSelectedCats] = useState<Set<Category>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalProject, setModalProject] = useState<GalleryItem | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [cardWidth, setCardWidth] = useState(300);
  const [isMobile, setIsMobile] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveringRef = useRef(false);
  const isModalOpenRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  // Touch tracking
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isTouchScrollingRef = useRef(false);

  // Compute filtered list
  const filtered = selectedCats.size === 0
    ? projects
    : projects.filter((p) => selectedCats.has(p.category as Category));
  const totalItems = filtered.length;
  const currentPosition = activeIndex + 1;

  // Measure card width + detect mobile
  useLayoutEffect(() => {
    function updateDimensions() {
      const vw = window.innerWidth;
      setIsMobile(vw < 640);

      if (stageRef.current) {
        const stageWidth = stageRef.current.offsetWidth;
        let newWidth: number;
        if (vw < 380) {
          newWidth = Math.min(200, stageWidth * 0.62);
        } else if (vw < 480) {
          newWidth = Math.min(220, stageWidth * 0.58);
        } else if (vw < 640) {
          newWidth = Math.min(240, stageWidth * 0.52);
        } else if (vw < 768) {
          newWidth = Math.min(260, stageWidth * 0.38);
        } else {
          newWidth = Math.min(320, Math.max(220, stageWidth * 0.22));
        }
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

  // Reset index when filter changes, and trigger a brief staggered entrance
  // for the newly filtered set of cards instead of them popping in instantly
  const [justFiltered, setJustFiltered] = useState(false);
  useEffect(() => {
    setActiveIndex(0);
    setJustFiltered(true);
    const t = setTimeout(() => setJustFiltered(false), 550);
    return () => clearTimeout(t);
  }, [selectedCats]);

  // Preload the previous/current/next active images so navigating never
  // shows a flicker while a card image is still fetching in from the network
  useEffect(() => {
    if (!totalItems) return;
    [activeIndex - 1, activeIndex, activeIndex + 1].forEach((i) => {
      const p = filtered[(i + totalItems) % totalItems];
      if (!p) return;
      const img = new window.Image();
      img.src = p.images[0];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, totalItems, selectedCats]);

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
    if (isMobile) {
      stopAuto();
      return;
    }

    startAuto();
    return stopAuto;
  }, [totalItems, isMobile]);

  // Navigation
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

  // ─── Pointer drag (desktop / trackpad) ───────────────────────────────────
  const handleDragStart = (e: React.PointerEvent) => {
    // Don't intercept touch — handled separately
    if (e.pointerType === "touch") return;
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    stopAuto();
    if (stageRef.current) stageRef.current.style.cursor = "grabbing";
  };

  const handleDragMove = useCallback((e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (!isDraggingRef.current) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 30) {
      isDraggingRef.current = false;
      delta > 0 ? goToPrevious() : goToNext();
      if (stageRef.current) stageRef.current.style.cursor = "";
    }
  }, [goToPrevious, goToNext]);

  const handleDragEnd = useCallback((e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    isDraggingRef.current = false;
    if (stageRef.current) stageRef.current.style.cursor = "";
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

  // ─── Native touch handlers (mobile swipe) ───────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isTouchScrollingRef.current = false;
    stopAuto();
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartXRef.current;
    const dy = e.touches[0].clientY - touchStartYRef.current;

    // If primarily vertical, let the page scroll
    if (!isTouchScrollingRef.current && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
      isTouchScrollingRef.current = true;
    }

    // If horizontal swipe, prevent page scroll and handle carousel
    if (!isTouchScrollingRef.current && Math.abs(dx) > 8) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isTouchScrollingRef.current) {
      startAuto();
      return;
    }
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    const dy = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only trigger swipe if horizontal movement is dominant and >= 40px
    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy)) {
      dx > 0 ? goToPrevious() : goToNext();
    }
    startAuto();
  }, [goToPrevious, goToNext]);

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
      newSet.has(cat) ? newSet.delete(cat) : newSet.add(cat);
      return newSet;
    });
  }

  const activeProject = filtered[activeIndex] ?? null;
  const cardHeight = cardWidth * 1.4;

  // Stage height: taller on mobile to give room for the card + reflection
  const stageHeight = isMobile
    ? Math.round(cardHeight * 1.18)
    : 420;

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
            <span className={styles.catBtnLabel}>CATEGORIES</span>
            <span className={styles.catBtnChevron}>{dropOpen ? "▲" : "▼"}</span>
            {selectedCats.size > 0 && (
              <span className={styles.catBadge}>{selectedCats.size}</span>
            )}
          </button>
          {dropOpen && (
            <div className={styles.dropdown}>
              <button
                className={`${styles.dropItem} ${selectedCats.size === 0 ? styles.dropItemActive : ""}`}
                onClick={() => { setSelectedCats(new Set()); setDropOpen(false); }}
              >
                <span className={styles.dropIcon}>✦</span>ALL
                {selectedCats.size === 0 && <span className={styles.dropCheck}>✓</span>}
              </button>
              <div className={styles.dropDivider} />
             {CATEGORY_LIST.map((cat) => (
  <button
    key={cat}
    className={`${styles.dropItem} ${selectedCats.has(cat) ? styles.dropItemActive : ""}`}
    onClick={() => {
      toggleCategory(cat);
      setDropOpen(false);
    }}
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

      {/* 3D Coverflow Stage */}
      <div
        className={styles.stage}
        ref={stageRef}
        style={{ height: stageHeight }}
        onPointerDown={handleDragStart}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
            const shouldRender = !isMobile || Math.abs(idx - activeIndex) <= 1;
            if (!shouldRender) return null;

            const offset = idx - activeIndex;
            const { dim, ...transformStyle } = getCoverflowTransform(offset, cardWidth, isMobile);
            const isActive = offset === 0;

            return (
              <CoverflowCard
                key={project.id}
                project={project}
                isActive={isActive}
                isMobile={isMobile}
                justFiltered={justFiltered}
                offset={offset}
                dim={dim}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                transformStyle={transformStyle}
                onClick={() => {
                  if (isActive) openModal(project);
                  else goToIndex(idx);
                }}
              />
            );
          })}
        </div>

        <div className={styles.reflectionStrip} />
      </div>

      {/* Info Panel */}
      {activeProject && (
        <div className={styles.infoPanel}>
          <span className={styles.infoCat} style={{ color: activeProject.accent }}>
            {CATEGORY_ICONS[activeProject.category]} {activeProject.category}
          </span>
          <h2 className={styles.infoTitle}>{activeProject.title}</h2>
          <p className={styles.infoSub}>{activeProject.sub}</p>
        </div>
      )}

      {/* Dot Navigation */}
      <div className={styles.controls}>
        <button className={styles.navArrow} onClick={goToPrevious} aria-label="Previous">←</button>
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
        <button className={styles.navArrow} onClick={goToNext} aria-label="Next">→</button>
      </div>

      <p className={styles.dragHint}>← SWIPE OR DRAG →</p>

      {/* Modal Portal */}
      {portalReady && modalProject && createPortal(
        <Modal project={modalProject} onClose={closeModal} />,
        document.body
      )}
    </section>
  );
}

// ─── Coverflow Card ────────────────────────────────────────────────────────────
// Extracted so useImageLoaded (a hook) can be called once per card instead of
// inside the parent's .map() loop, which would break the Rules of Hooks.
function CoverflowCard({
  project,
  isActive,
  isMobile,
  justFiltered,
  offset,
  dim,
  cardWidth,
  cardHeight,
  transformStyle,
  onClick,
}: {
  project: GalleryItem;
  isActive: boolean;
  isMobile: boolean;
  justFiltered: boolean;
  offset: number;
  dim: number;
  cardWidth: number;
  cardHeight: number;
  transformStyle: React.CSSProperties;
  onClick: () => void;
}) {
  const loaded = useImageLoaded(project.images[0]);

  return (
    <div
      className={`${styles.cfCard} ${isActive ? styles.cfCardActive : ""} ${justFiltered ? styles.cfCardFilterIn : ""}`}
      style={{
        width: cardWidth,
        height: cardHeight,
        marginLeft: -cardWidth / 2,
        marginTop: -cardHeight / 2,
        background: project.bg,
        animationDelay: justFiltered ? `${Math.min(Math.abs(offset), 5) * 55}ms` : undefined,
        ...transformStyle,
      }}
      onClick={onClick}
    >
      <img
        src={project.images[0]}
        alt={project.title}
        className={`${styles.cfCardImg} ${loaded ? "" : styles.cfCardImgLoading}`}
        draggable={false}
        loading={isMobile ? "eager" : "lazy"}
        decoding="async"
      />
      <div className={styles.cfCardOverlay} />
      {dim > 0 && <div className={styles.cfCardDim} style={{ opacity: dim }} />}
      {isActive && <div className={styles.shimmerRing} />}
      {!isMobile && (
        <div className={styles.cfCardReflection}>
          <img
            src={project.images[0]}
            alt=""
            className={styles.cfCardReflectionImg}
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
    </div>
  );
}

// ─── Modal Component ──────────────────────────────────────────────────────────
// Every image renders fully contained (scaled to fit, no cropping, no internal
// scroll) — the same simple box for every project and category, so the modal
// always looks consistent (title/category/description always visible below).

function Modal({ project, onClose }: { project: GalleryItem; onClose: () => void }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Mouse drag
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  // Touch swipe in modal
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isTouchScrollRef = useRef(false);
  // UI/UX Design projects get a larger image area in the modal.
  const isUiUx = project.category === "UI/UX DESIGN";

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
    };
    const handleMouseUp = () => { dragRef.current.active = false; };
    const strip = stripRef.current;
    strip?.addEventListener("scroll", updateImageIndex);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      strip?.removeEventListener("scroll", updateImageIndex);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [updateImageIndex]);

  // Prevent background scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleModalTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isTouchScrollRef.current = false;
  };

  const handleModalTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartXRef.current;
    const dy = e.touches[0].clientY - touchStartYRef.current;
    if (!isTouchScrollRef.current && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
      isTouchScrollRef.current = true;
    }
    // horizontal swipe in the image strip — let native scroll handle it
  };

  return (
  <div className={styles.modalBackdrop} onClick={onClose}>
    <div
      className={styles.modalBgGlow}
      style={{ backgroundImage: `url(${project.images[0]})` }}
      aria-hidden="true"
    />
    <div
      className={`${styles.modal} ${isUiUx ? styles.modalUiux : ""}`}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={handleModalTouchStart}
      onTouchMove={handleModalTouchMove}
    >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.modalImgWrap}>
          <div
            className={styles.modalImgStrip}
            ref={stripRef}
            onMouseDown={(e) => {
              if (!stripRef.current) return;
              dragRef.current = { active: true, startX: e.clientX, scrollLeft: stripRef.current.scrollLeft };
            }}
          >
            {project.images.map((src, idx) => (
              <div className={styles.modalImgSlide} key={idx}>
                <div className={styles.modalImgFrame}>
                  <ModalSlideImage src={src} alt={`${project.title} - ${idx + 1}`} />
                </div>
              </div>
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
          {(project.link || project.mobileWarning) && (
            <div className={styles.modalLinkWrap} data-no-drag="true">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalLinkBtn}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className={styles.modalLinkIcon}>🔗</span>
                  Visit Website
                </a>
              )}
              {project.mobileWarning && (
                <span className={styles.modalMobileWarning}>
                  <span className={styles.modalMobileWarningIcon}>⚠</span>
                  Not built for mobile — best viewed on desktop
                </span>
              )}
            </div>
          )}
          {project.images.length > 1 && (
            <p className={styles.modalSwipeHint}>← SWIPE TO EXPLORE MORE →</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Modal Slide Image ─────────────────────────────────────────────────────────
// Extracted so useImageLoaded (a hook) can be called once per slide instead of
// inside the parent's .map() loop, which would break the Rules of Hooks.
function ModalSlideImage({ src, alt }: { src: string; alt: string }) {
  const loaded = useImageLoaded(src);
  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.modalImg} ${loaded ? "" : styles.modalImgLoading}`}
      draggable={false}
    />
  );
}