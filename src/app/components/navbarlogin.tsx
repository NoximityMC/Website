import Image from "next/image";
import styles from "../style/navbar.module.scss";

type User = {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    rank?: {
        name?: string;
        color?: string;
        id?: number;
    } | null | undefined;
} | undefined

type Props = {
    user: User,
    pagetype: string,
}

export default function Card({ user, pagetype }: Props) {

    const greeting = user?.name ? (
        <div>
            Hello {user?.name}!
        </div>
    ) : null

    const emailDisplay = user?.email ? (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg font-bold text-5xl text-black">
            {user?.email}
        </div>
    ) : null

    const userImage = user?.image ? (
        <Image
            className={styles.userImage}
            src={user?.image}
            width={64}
            height={64}
            alt={user?.name ?? "Profile Pic"}
            priority={true}
        />
    ) : null

    const userName = user?.name ? (
        <p className={styles.userName}>
            {user?.name}
        </p>
    ) : null

    var rankColor = '';
    if (user?.rank?.color) {
        const colorAsNumber = parseInt(user?.rank?.color, 16);
        if (!isNaN(colorAsNumber)) {
            rankColor = '#' + colorAsNumber.toString(16);
        }
    }

    const userRank = user?.rank ? (
        <p className={styles.userRank} style={{ backgroundColor: `${rankColor}`}}>
            {user?.rank.name}
        </p>
    ) : null

    return (
      <div>
        <section className={styles.displayLoginInfo}>
          <a className={styles.navProfile}>
            <>
              {userImage}
              {userName}
              {userRank}
            </>
          </a>
        </section>
      </div>
    );
}