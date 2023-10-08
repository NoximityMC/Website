import DiscordProvider from 'next-auth/providers/discord'
import Bottleneck from 'bottleneck';
import { cookies } from "next/headers"
import { Session } from 'inspector';
import { getDiscordInfo } from '@/app/lib/misc';

const limiter = new Bottleneck({
    maxConcurrent: 1, // Number of concurrent requests
    minTime: 1000,   // Minimum time between requests in milliseconds
});

export const options = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            token: "https://discord.com/api/oauth2/token",
            userinfo: "https://discord.com/api/users/@me",
            authorization: {
                params: {
                    scope: "identify email"
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token, user }) {
            if (session.user) {
                session.user.id = token.sub;
                const memData = await limiter.schedule(async () => {
                    const data = await getDiscordInfo(session.user.id, true);
                    return data;
                });
    
                session.user.name = memData.name;
                session.user.rank = memData.rank;
                session.user.staff = memData.staff;
                session.user.admin = memData.admin;
            }

            return session;
        },

        async jwt({ token, account }){
            if (account){
                token.accessToken = account.access_token
            }
            return token;
        }
    }
}