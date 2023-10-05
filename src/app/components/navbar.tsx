'use client'

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { HiMiniShoppingCart, HiUserPlus } from 'react-icons/hi2';
import logo from '../assets/logos/full/NoximityCompanyLight.svg';
import styles from '../style/navbar.module.scss';
import usercardstyles from '../style/usercard.module.scss';
import NavBarLogin from './navbarlogin';


export default function Navbar() {

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/client')
        }
    })

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
                    <a href="/">
                        <HiMiniShoppingCart color="#b6afdc" /> Search
                    </a>
                    <a href="/">
                        <HiUserPlus color="#b6afdc" /> Account
                    </a>
                    <NavBarLogin user={session?.user} pagetype={"Client"} />
                </div>
            </section>
        </nav>
    );
}
