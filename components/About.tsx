"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./About.module.css";

type VisState = "hidden" | "visible" | "hiding";

function useScrollAnim() {
    const ref = useRef<HTMLDivElement>(null);
    const [visState, setVisState] = useState<VisState>("hidden");
    const [animKey, setAnimKey] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisState("hidden");
                    requestAnimationFrame(() =>
                        requestAnimationFrame(() => {
                            setVisState("visible");
                            setAnimKey((k) => k + 1);
                        })
                    );
                } else {
                    setVisState("hiding");
                }
            },
            { threshold: 0.01, rootMargin: "0px 0px -30px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const anim =
        visState === "visible"
            ? styles.animate
            : visState === "hiding"
            ? styles.hiding
            : styles.hidden;

    return { ref, anim, animKey };
}

/* ── Skill bar data ── */
const skills = [
    { label: "Brand Identity", pct: 92 },
    { label: "UI / UX Design", pct: 88 },
    { label: "Web Development", pct: 85 },
    { label: "Systems Development", pct: 80 },
    { label: "Typography", pct: 90 },
    { label: "Art Direction", pct: 82 },
];

/* ── Tool stack ── */
const tools = [
    { name: "Figma", icon: "◈" },
    { name: "After Effects", icon: "◉" },
    { name: "Illustrator", icon: "◇" },
    { name: "Photoshop", icon: "⬡" },
    { name: "React", icon: "⊛" },
    { name: "Next.js", icon: "⬢" },
    { name: "TypeScript", icon: "◎" },
    { name: "Tailwind", icon: "⊕" },
];

/* ── Service tool tags per service ── */
type ServiceTool = { symbol: string; label: string };

const serviceTools: ServiceTool[][] = [
    /* 01 — Brand Identity */
    [
        { symbol: "Ps", label: "Photoshop" },
        { symbol: "Ai", label: "Illustrator" },
        { symbol: "Id", label: "InDesign" },
        { symbol: "◇", label: "Vector" },
        { symbol: "⬡", label: "Grids" },
    ],
    /* 02 — UI / UX Design */
    [
        { symbol: "Fg", label: "Figma" },
        { symbol: "◈", label: "Components" },
        { symbol: "⊛", label: "Prototype" },
        { symbol: "◎", label: "Tokens" },
        { symbol: "▣", label: "Wireframe" },
    ],
    /* 03 — Web Development */
    [
        { symbol: "Nx", label: "Next.js" },
        { symbol: "Ts", label: "TypeScript" },
        { symbol: "⊕", label: "Tailwind" },
        { symbol: "⬢", label: "React" },
        { symbol: "{ }", label: "CSS" },
    ],
    /* 04 — Systems Development */
    [
        { symbol: "C#", label: "C Sharp" },
        { symbol: ".N", label: ".NET" },
        { symbol: "Sq", label: "SQL" },
        { symbol: "◑", label: "APIs" },
        { symbol: "⊞", label: "MVC" },
    ],
];

/* ── Services ── */
const services = [
    {
        number: "01",
        title: "Brand Identity",
        desc: "Logo systems, visual language, color theory, and brand guidelines that make your mark unforgettable.",
    },
    {
        number: "02",
        title: "UI / UX Design",
        desc: "Interfaces that feel effortless — wireframes, prototypes, and pixel-perfect handoff ready for dev.",
    },
    {
        number: "03",
        title: "Web Development",
        desc: "Clean, performant Next.js builds with attention to animation, accessibility, and code quality.",
    },
    {
        number: "04",
        title: "Systems Development",
        desc: "Robust enterprise applications in .NET and C# — procurement systems, workflows, and data-driven backends.",
    },
];

/* ── Single service card with hover tool reveal ── */
function ServiceCard({
    number,
    title,
    desc,
    toolTags,
    animClass,
    delay,
}: {
    number: string;
    title: string;
    desc: string;
    toolTags: ServiceTool[];
    animClass: string;
    delay: string;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`${styles.serviceCard} ${animClass}`}
            style={{ animationDelay: delay }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span className={styles.serviceNumber}>{number}</span>

            <div className={styles.serviceContent}>
                <h4 className={styles.serviceTitle}>{title}</h4>
                <p className={styles.serviceDesc}>{desc}</p>
            </div>

            {/* Tool tags — reveal on hover */}
            <div className={`${styles.kzStage} ${hovered ? styles.kzRing : ""}`}>
                {toolTags.map(({ symbol, label }, i) => (
                    <span
                        key={label}
                        className={styles.serviceToolTag}
                        style={{ transitionDelay: `${i * 0.045}s` }}
                        title={label}
                    >
                        {symbol}
                    </span>
                ))}
            </div>

            <span className={`${styles.serviceArrow} ${hovered ? styles.serviceArrowVisible : ""}`}>↗</span>
        </div>
    );
}

export default function About() {
    /* ── Intersection hooks per section ── */
    const heroSection = useScrollAnim();
    const skillsSection = useScrollAnim();
    const servicesSection = useScrollAnim();
    const toolsSection = useScrollAnim();

    return (
        <div className={styles.page}>
            {/* ═══════════════ HERO / INTRO ═══════════════ */}
            <div ref={heroSection.ref} className={styles.heroSection}>
                <div className={styles.introWrapper}>
                    <div className={styles.labelRow}>
                        <span
                            key={`lr-${heroSection.animKey}`}
                            className={`${styles.sectionLabel} ${heroSection.anim}`}
                        >
                            ✦ ABOUT ME
                        </span>
                    </div>

                    <h2
                        key={`h2-${heroSection.animKey}`}
                        className={`${styles.introHeading} ${heroSection.anim}`}
                    >
                        Great Design Is Not<br />
                        <span className={styles.headingAccent}>Just Seen — It Is Felt</span>
                    </h2>

                    <div
                        key={`glow-${heroSection.animKey}`}
                        className={`${styles.introGlow} ${heroSection.anim}`}
                    />

                    <p
                        key={`bio-${heroSection.animKey}`}
                        className={`${styles.bio} ${heroSection.anim}`}
                    >
                        Hi, I&apos;m{" "}
                        <strong className={styles.bioName}>Erastus Shindinge</strong> — a
                        graphic designer and software developer based in{" "}
                        <strong>Windhoek, Namibia</strong>. I live at the intersection of
                        aesthetics and engineering, crafting brands and digital experiences
                        that communicate with clarity and visual precision.
                    </p>

                    <div
                        key={`divider-hero-${heroSection.animKey}`}
                        className={`${styles.divider} ${heroSection.anim}`}
                    />

                    <div
                        key={`stats-${heroSection.animKey}`}
                        className={`${styles.stats} ${heroSection.anim}`}
                    >
                        {[
                            { num: "3+", label: "Years Experience" },
                            { num: "40+", label: "Projects Completed" },
                            { num: "6+", label: "Clients Served" },
                            { num: "∞", label: "Ideas Brewing" },
                        ].map(({ num, label }) => (
                            <div key={label} className={styles.statItem}>
                                <span className={styles.statNumber}>{num}</span>
                                <span className={styles.statLabel}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════════════ SKILLS ═══════════════ */}
            <div ref={skillsSection.ref} className={styles.section}>
                <div
                    key={`sk-label-${skillsSection.animKey}`}
                    className={`${styles.sectionLabel} ${skillsSection.anim}`}
                >
                    ⊡ SKILLS & EXPERTISE
                </div>

                <h3
                    key={`sk-h3-${skillsSection.animKey}`}
                    className={`${styles.sectionHeading} ${skillsSection.anim}`}
                >
                    Where Craft Meets Code
                </h3>

                <div className={styles.skillsGrid}>
                    {skills.map(({ label, pct }, i) => (
                        <div
                            key={`${label}-${skillsSection.animKey}`}
                            className={`${styles.skillRow} ${skillsSection.anim}`}
                            style={{ animationDelay: `${0.1 + i * 0.12}s` }}
                        >
                            <div className={styles.skillMeta}>
                                <span className={styles.skillLabel}>{label}</span>
                                <span className={styles.skillPct}>{pct}%</span>
                            </div>
                            <div className={styles.skillTrack}>
                                <div
                                    className={`${styles.skillFill} ${skillsSection.anim === styles.animate ? styles.fillAnimate : ""}`}
                                    style={
                                        {
                                            "--target-width": `${pct}%`,
                                            animationDelay: `${0.3 + i * 0.12}s`,
                                        } as React.CSSProperties
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════ SERVICES ═══════════════ */}
            <div ref={servicesSection.ref} className={styles.section}>
                <div
                    key={`sv-label-${servicesSection.animKey}`}
                    className={`${styles.sectionLabel} ${servicesSection.anim}`}
                >
                    ▷ WHAT I DO
                </div>

                <h3
                    key={`sv-h3-${servicesSection.animKey}`}
                    className={`${styles.sectionHeading} ${servicesSection.anim}`}
                >
                    Services I Offer
                </h3>

                <div
                    key={`sv-divider-${servicesSection.animKey}`}
                    className={`${styles.divider} ${servicesSection.anim}`}
                />

                <div className={styles.servicesGrid}>
                    {services.map(({ number, title, desc }, i) => (
                        <ServiceCard
                            key={`${number}-${servicesSection.animKey}`}
                            number={number}
                            title={title}
                            desc={desc}
                            toolTags={serviceTools[i]}
                            animClass={`${servicesSection.anim}`}
                            delay={`${0.15 + i * 0.15}s`}
                        />
                    ))}
                </div>
            </div>

            {/* ═══════════════ TOOLS ═══════════════ */}
            <div ref={toolsSection.ref} className={styles.section}>
                <div
                    key={`tl-label-${toolsSection.animKey}`}
                    className={`${styles.sectionLabel} ${toolsSection.anim}`}
                >
                    ◈ MY TOOLBOX
                </div>

                <h3
                    key={`tl-h3-${toolsSection.animKey}`}
                    className={`${styles.sectionHeading} ${toolsSection.anim}`}
                >
                    Tools of the Trade
                </h3>

                <div
                    key={`tl-grid-${toolsSection.animKey}`}
                    className={`${styles.toolsGrid} ${toolsSection.anim}`}
                >
                    {tools.map(({ name, icon }, i) => (
                        <div
                            key={name}
                            className={styles.toolCard}
                            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                        >
                            <span className={styles.toolIcon}>{icon}</span>
                            <span className={styles.toolName}>{name}</span>
                        </div>
                    ))}
                </div>

                <div
                    key={`tl-divider-${toolsSection.animKey}`}
                    className={`${styles.divider} ${toolsSection.anim}`}
                    style={{ animationDelay: "0.8s" }}
                />

                <div
                    key={`tl-cta-${toolsSection.animKey}`}
                    className={`${styles.ctaRow} ${toolsSection.anim}`}
                    style={{ animationDelay: "1s" }}
                >
                    <p className={styles.ctaText}>
                        Ready to build something memorable?
                    </p>
                    <a href="#contact" className={styles.ctaBtn}>
                        LET&apos;S TALK <span className={styles.ctaArrow}>↗</span>
                    </a>
                </div>
            </div>
        </div>
    );
}