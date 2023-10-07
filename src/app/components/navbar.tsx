'use client'

import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { PiBasketFill, PiDiscordLogoDuotone, PiSignOut } from 'react-icons/pi';
import logo from '../assets/logos/full/NoximityCompanyLight.svg';
import styles from '../style/navbar.module.scss';
import NavBarLogin from './navbarlogin';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSession } from '../lib/next-auth-react-query';

export default function Navbar() {

    const [session, loading] = useSession({
      required: false,
      redirectTo: '/api/auth/signin?callbackUrl=/client',
      queryConfig: {
        staleTime: 60 * 1000 * 60 * 3, // 3 hours,
        refetchInterval: 60 * 1000 * 5, // 5 minutes
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
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className={styles.trigger}>
                  <div id="profile">
                    <div>
                      <NavBarLogin user={session?.user} pagetype={"Client"} />
                    </div>
                  </div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className={styles.content}>
                  <DropdownMenu.Item onClick={function() {
                    signOut()
                  }}>Logout</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              </>
            </div>
          </nav>
        );
    }
}
