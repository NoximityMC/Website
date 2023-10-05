import Image from "next/image"
import styles from "../style/usercard.module.scss"

type User = {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
} | undefined

type Props = {
    user: User,
    pagetype: string,
}

export default function Card({ user, pagetype }: Props) {

    //console.log(user)

    const greeting = user?.name ? (
        <div className={styles.greeting}>
            Hello {user?.name}!
        </div>
    ) : null

    // const emailDisplay = user?.email ? (
    //     <div className="flex flex-col items-center p-6 bg-white rounded-lg font-bold text-5xl text-black">
    //         {user?.email}
    //     </div>
    // ) : null

    const userImage = user?.image ? (
        <Image
            className={styles.userImage}
            src={user?.image}
            width={200}
            height={200}
            alt={user?.name ?? "Profile Pic"}
            priority={true}
        />
    ) : null

    return (
        <section className={styles.display}>
            {greeting}
            {/* {emailDisplay} */}
            {userImage}
            <p className="text-2xl text-center">{pagetype} Page!</p>
        </section>
    )
}