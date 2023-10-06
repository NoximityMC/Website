'use client'

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { PiBasketFill, PiDiscordLogoDuotone, PiSignOut } from 'react-icons/pi';
import logo from '../assets/logos/full/NoximityCompanyLight.svg';
import styles from '../style/navbar.module.scss';
import NavBarLogin from './navbarlogin';


export default function Navbar() {

    const { data: session } = useSession({
        required: false,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/client')
        }
    })

    if (session == null) {
        return (
            <nav className={styles.nav}>
                <section className={styles.width}>
                    <div className={styles.left}>
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
                        <a href="api/auth/signin">
                            <PiDiscordLogoDuotone size="20px" color="#b6afdc" /> Sign In
                        </a>
                    </div>
                </section>
            </nav>
        )
    } else {
        return (
            <nav className={styles.nav}>
                <section className={styles.width}>
                    <div className={styles.left}>
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
                        <a href="/">Shop</a>
                        <a href="/">Explore</a>
                        <a href="/">Help</a>
                    </div>
                    <div className={styles.right}>
                        <a href="/">
                            <PiBasketFill size="20px" color="#b6afdc" /> Shop
                        </a>
                        <NavBarLogin user={session?.user} pagetype={"Client"} />
                        <a href="/api/auth/signout">
                            <PiSignOut size="20px" color="#b6afdc" />
                            Sign Out
                        </a>
                    </div>
                </section>
            </nav>
        )
    }
}
