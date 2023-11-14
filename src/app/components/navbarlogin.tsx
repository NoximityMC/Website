import Image from "next/image";
import styles from "../style/navbar.module.scss";
import { Avatar } from "@nextui-org/react";
import md5 from "md5";

type User = {
	username: string | null | undefined;
	email: string | null | undefined;
	discord : {
		name: string;
		rank: {
			name?: string;
			color?: number;
			id?: number;
		} | null | undefined;
		staff: boolean;
		admin: boolean;
	} | null | undefined;
} | undefined

type Props = {
	user: User,
	pagetype: string,
}

export default function Card({ user, pagetype }: Props) {

	const hash = md5(user?.email!);
	const avatar = `https://www.gravatar.com/avatar/${hash}`;
	const userImage = <Avatar isBordered radius="full" size="md" style={{ marginRight: '10px' }} src={avatar} />

	const userName = user?.username ? (
		<p className={styles.userName}>
			{user?.username}
		</p>
	) : null

	const userRank = (user?.discord?.rank && user.discord.rank.color) ? (
		<p className={styles.userRank} style={{ backgroundColor: `#${(user?.discord.rank?.color).toString(16)}`}}>
			{user?.discord.rank.name}
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