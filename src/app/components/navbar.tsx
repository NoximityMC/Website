'use client'

import { signIn, signOut, useSession } from 'next-auth/react';
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
          <nav className={styles.navbar}>
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
                <a href="/">VoidBound</a>
              </div>
              <div className={styles.right}>
                <a onClick={() => signIn("discord")}>
                  <PiDiscordLogoDuotone size="20px" color="#b6afdc" /> Sign In
                </a>
              </div>
          </nav>
        );
    } else {
        return (
          <nav className={styles.navbar}>
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
              <a href="/">VoidBound</a>
            </div>
            <div className={styles.right}>
              <>
                <div id="profile">
                  <NavBarLogin user={session?.user} pagetype={"Client"} />
                </div>
              </>
            </div>
          </nav>
        );
    }
}
