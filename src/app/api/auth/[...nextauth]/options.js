import DiscordProvider from 'next-auth/providers/discord'
import Bottleneck from 'bottleneck';
import { cookies } from "next/headers"
import { Session } from 'inspector';

const limiter = new Bottleneck({
    maxConcurrent: 1, // Number of concurrent requests
    minTime: 1000,   // Minimum time between requests in milliseconds
});

function extractFirstPart(inputString) {
    // Check if the inputString contains " - "
    if (inputString.includes(" - ")) {
      // Split the inputString by " - " and return the first part
      return inputString.split(" - ")[0];
    } else {
      // If " - " is not found, return the original inputString
      return inputString;
    }
}

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
                    const memRes = await fetch(`https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${session.user.id}`, {
                        headers: {
                            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
                        }
                    });
    
                    if (memRes.ok) {
                        const mem = await memRes.json();
                        const name = mem.user.global_name;
                        var roles = mem.roles;
                        const ignoredRoles = process.env.DISCORD_IGNORED_ROLES?.split(', ') || [];
                        const staffRoles = process.env.DISCORD_STAFF_ROLES?.split(', ') || [];
                        const adminRoles = process.env.DISCORD_ADMIN_ROLES?.split(', ') || [];
    
                        if (roles.some((r) => staffRoles.includes(r))) {
                            session.user.staff = true;
                        } else {
                            session.user.staff = false;
                        }
    
                        if (roles.some((r) => adminRoles.includes(r))) {
                            session.user.admin = true;
                        } else {
                            session.user.admin = false;
                        }
                        
                        roles = roles.filter((r) => !ignoredRoles.includes(r));
    
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
                                const matchingObject = role.find((r) => r.id === id);
                                if (matchingObject && matchingObject.position > highestPosition) {
                                    highestPosition = matchingObject.position;
                                    highestPositionID = matchingObject.id;
                                }
                            }
    
                            const rank = role.find((r) => r.id === highestPositionID);
    
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