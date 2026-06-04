"use client";
import styles from "./Home.module.css";
import Link from "next/link";


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

   
    



      
    </section>
  );
}