import type { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import Bottleneck from 'bottleneck';
import NodeCache from 'node-cache';
const cache = new NodeCache();

const limiter = new Bottleneck({
    maxConcurrent: 1, // Number of concurrent requests
    minTime: 1000,   // Minimum time between requests in milliseconds
});

function extractFirstPart(inputString:string) {
    // Check if the inputString contains " - "
    if (inputString.includes(" - ")) {
      // Split the inputString by " - " and return the first part
      return inputString.split(" - ")[0];
    } else {
      // If " - " is not found, return the original inputString
      return inputString;
    }
}

export const options: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            token: "https://discord.com/api/oauth2/token",
            userinfo: "https://discord.com/api/users/@me",
            authorization: {
                params: {
                    scope: "identify email guilds guilds.members.read"
                }
            }
        })
    ],
    events: {
        async signOut({token}) {
            const cacheKey = `userRoles:${token.email}:${process.env.DISCORD_GUILD_ID}`;
            cache.del(cacheKey);
        }
    },
    callbacks: {
        async session({ session, token, user }) {
            const cacheKey = `userRoles:${session.user?.email}:${process.env.DISCORD_GUILD_ID}`;

            const cachedMem = cache.get(cacheKey);

            if (cachedMem) {
                session.user.name = cachedMem.name;
                session.user.rank = cachedMem.rank;
            } else {
                const memData = await limiter.schedule(async () => {
                    const memRes = await fetch(`https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`, {
                        headers: {
                            Authorization: `Bearer ${token.accessToken}`
                        }
                    });

                    if (memRes.ok) {
                        const mem = await memRes.json();
                        const name = mem.user.global_name;
                        var roles = mem.roles;
                        const ignoredRoles = process.env.DISCORD_IGNORED_ROLES?.split(', ') || [];
                        roles = roles.filter((r: any) => !ignoredRoles.includes(r));

                        const roleRes = await fetch(`https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/roles`, {
                            headers: {
                                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
                            }
                        });

                        var highestPosition = -1;
                        var highestPositionID = '';

                        if (roleRes.ok) {
                            const role = await roleRes.json();

                            for (const id of roles) {
                                const matchingObject = role.find((r: any) => r.id === id);
                                if (matchingObject && matchingObject.position > highestPosition) {
                                    highestPosition = matchingObject.position;
                                    highestPositionID = matchingObject.id;
                                }
                            }

                            const rank = role.find((r: any) => r.id === highestPositionID);

                            if (rank) {
                                const rankName = extractFirstPart(rank.name);

                                return {
                                    name: name,
                                    rank: {
                                        name: rankName,
                                        color: rank.color,
                                        id: rank.id
                                    }
                                }
                            }

                        }

                        return {
                            name: name,
                            rank: null
                        };
                    } else {
                        return {
                            name: null,
                            rank: null
                        };
                    }
                });

                session.user.name = memData.name;
                session.user.rank = memData.rank;

                cache.set(cacheKey, memData, 300)
            }

            return session;
        },

        async jwt({ token, account }){
            if (account){
                token.accessToken = account.access_token
            }
            return token;
        }
    },
}