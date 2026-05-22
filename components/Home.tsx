"use client";
import styles from "./Home.module.css";

export default function HomeComp() {
  return (
    <section className={styles.hero}>
      <div className={`${styles.headlines} ${styles.animate}`}>
        <h1 className={styles.headline}>Designing With Intention.</h1>
        <h1 className={styles.headline}>Building with Precision.</h1>
      </div>

      <div className={`${styles.yearRow} ${styles.animate}`}>
        <span className={styles.year}>2026</span>
        <div className={styles.portfolioGroup}>
          <div className={`${styles.glowOrb} ${styles.animate}`} />
          <span className={styles.portfolioLabel}>PORTFOLIO</span>
        </div>
      </div>

      <p className={`${styles.subtext} ${styles.animate}`}>
        I craft meaningful designs and{" "}
        <strong>build digital experiences</strong>
        <br />
        that are <strong>thoughtful</strong>, functional and visually striking.
      </p>

      <button className={`${styles.ctaBtn} ${styles.animate}`}>
        EXPLORE MY WORK <span className={styles.arrow}>↗</span>
      </button>

      <div className={`${styles.categories} ${styles.animate}`}>
        {[
          { icon: "✦", label: "BRANDING" },
          { icon: "⊡", label: "UI/UX DESIGN" },
          { icon: "⊕", label: "WEB DESIGN" },
          { icon: "▷", label: "MOTION DESIGN" },
        ].map(({ icon, label }) => (
          <div key={label} className={styles.pill}>
            <span className={styles.pillIcon}>{icon}</span>
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}