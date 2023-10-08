'use client'

import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { GoPerson, GoShieldLock, GoSignOut, GoSignIn } from "react-icons/go";
import logo from '../assets/logos/full/NoximityCompanyLight.svg';
import styles from '../style/navbar.module.scss';
import NavBarLogin from './navbarlogin';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Session } from 'next-auth';
import { AuthCheck } from '../lib/misc';

export default function Navbar({session}: {session: Session}) {
    const router = useRouter();
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
                onClick={function () {
                  router.push("/");
                }}
                style={{ cursor: "pointer" }}
              />
              <a href="/">VoidBound</a>
            </div>
            <div className={styles.right}>
              <a onClick={() => signIn("discord")} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <GoSignIn size="20px" color="#b6afdc" />
                Sign In
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
                onClick={function () {
                  router.push("/");
                }}
                style={{ cursor: "pointer" }}
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
                    <DropdownMenu.Item
                      onClick={function () {
                        router.push("/profile");
                      }}
                    >
                      <div className={styles.contentIcon}>
                        <GoPerson size="20px" color="#b6afdc" />
                      </div>
                      Profile
                    </DropdownMenu.Item>
                    {AuthCheck(session, false) ? (
                      <DropdownMenu.Item
                        onClick={function () {
                          router.push("/admin");
                        }}
                      >
                        <div className={styles.contentIcon}>
                          <GoShieldLock size="20px" color="#b6afdc" />
                        </div>
                        Admin
                      </DropdownMenu.Item>
                    ) : null}
                    <DropdownMenu.Item
                      onClick={function () {
                        signOut();
                      }}
                    >
                      <div className={styles.contentIcon}>
                        <GoSignOut size="20px" color="#b6afdc" />
                      </div>
                      Logout
                    </DropdownMenu.Item>
                    <DropdownMenu.Arrow className={styles.arrow} />
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </>
            </div>
          </nav>
        );
    }
}
