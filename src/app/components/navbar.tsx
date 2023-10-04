import Image from "next/image";
import { HiMiniShoppingCart, HiUserPlus } from "react-icons/hi2";
import logo from "../assets/logos/full/NoximityCompanyLight.svg";
import styles from "../style/navbar.module.scss";

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <section className={styles.width}>
                <div className={styles.left}>
                    //Logo
                    <Image
                        src={logo}
                        alt="Noximity"
                        width={150}
                        height={35}
                        priority={true}
                        quality={100}
                        className={styles.logo}
                    />
                    <a href="/">Home</a>
                    <a href="https://noximity.studios/">Shop</a>
                    <a href="/">Explore</a>
                    <a href="/">Help</a>
                </div>
                <div className={styles.right}>
                    <a href="/">
                        <HiMiniShoppingCart color={"#b6afdc"} /> Search
                    </a>
                    <a href="/">
                        <HiUserPlus color={"#b6afdc"} /> Login
                    </a>
                </div>
            </section>
        </nav>
    );
}