"use client";

import { useEffect, useState } from "react";
import styles from "./navbar.module.css";

export default function Navbar() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <>
            <nav 
                className={`${styles.Navbar} ${isMounted ? styles.mounted : ""}`}
                suppressHydrationWarning
            >
                <ul className={`${styles.NavList} flex gap-8`}>
                    <li className={styles.NavItem}>
                        <a href="#home">Home</a>
                    </li>
                    <li className={styles.NavItem}>
                        <a href="#gallery">Projects</a>
                    </li>
                    <li className={styles.NavItem}>
                        <a href="#about">About</a>
                    </li>
                </ul>
            </nav>
        </>
    );
}