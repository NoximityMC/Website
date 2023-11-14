import { db } from "@/app/lib/db"
import { getDiscordInfo, isPasswordValid } from "@/app/lib/misc";
import CredentialsProvider from "next-auth/providers/credentials"
import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
	maxConcurrent: 1, // Number of concurrent requests
	minTime: 1000,   // Minimum time between requests in milliseconds
});

export const options = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: { label: 'Username', type: 'input', placeholder: 'Your username' },
				email: { label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
				password: { label: 'Password', type: 'password', placeholder: 'Your password' },
				totpCode: { label: 'Two-Factor Code', type: 'input', placeholder: 'Code from authenticator app' }
			},
			async authorize(credentials, req) {
				const user = await db.users.get.fromEmail(credentials.email);
				if (!user) {
					throw Error('invalid-user');
				}

				const match = isPasswordValid(credentials.password, user.password);
				if (!match) {
					throw Error('invalid-user')
				}

				if (!user.verifiedEmail || user.verifiedEmail == 0) {
					throw Error('verify-email')
				}

				
				const data = {
					id: user.id,
					uuid: user.uuid,
					username: user.username,
					email: user.email
				}
				
				if (user.discordId) {
					data.discord = {
						id: user.discordId
					}
				}

				return data
			}
		}),
	],
	callbacks: {
		async session({ session, token, user}) {
			session.user = token.user;

			const id = await db.users.discord.get(session.user.email);
			if (id) {
				session.user.discord = {
					id: id
				}
				const memData = await limiter.schedule(async () => {
					const data = await getDiscordInfo(id, true);
					return data;
				});
				session.user.discord.name = memData.name;
				session.user.discord.rank = memData.rank;
				session.user.discord.staff = memData.staff;
				session.user.discord.admin = memData.admin;
			} else {
				session.user.discord = null;
			}

			return session;
		},

		async jwt({ token, user, account }) {
			if (account && user) {
				return {
					...token,
					user: {
						...user,
						account,
					}
				}
			}

			return token
		}
	}
}