import styles from "./navbar.module.css"

export default function Navbar() {  
    return (
        <>
          
            <nav className={styles.Navbar}>
                <ul className={`${styles.NavList} flex gap-8`}>
                    <li className={styles.NavItem}><a href="#home">Home</a></li>
                    <li className={styles.NavItem}><a href="#gallery">Projects</a></li>
                    <li className={styles.NavItem}><a href="#about">About</a></li>
                </ul>
            </nav>
        </>
    )
}