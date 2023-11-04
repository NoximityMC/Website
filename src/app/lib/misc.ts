import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { Fetcher } from "swr";

export function AuthCheck(session: any, admin: boolean) {
	if (session.user) {
		if (admin && session.user.admin) {
			return true
		} else if (!admin && (session.user.staff || session.user.admin)) {
			return true
		}
	}
	return false;
}

export async function isAuthorized(req:any) {
	const token = await getToken({req});
	const session = getSession();
	const apiKey = req.headers.get('api-key');
	const keyRes = await fetch(`${process.env.NEXTAUTH_URL}/api/key/${apiKey}`, {
		cache: 'no-store'
	});
	var key = false;
	if (keyRes.ok) {
		var keyJson = await keyRes.json();
		key = keyJson.success;
	}
	return !!token || !!session || !!key;
}

export function extractFirstPart(inputString:string) {
	// Check if the inputString contains " - "
	if (inputString.includes(" - ")) {
	  // Split the inputString by " - " and return the first part
	  return inputString.split(" - ")[0];
	} else {
	  // If " - " is not found, return the original inputString
	  return inputString;
	}
}

export async function getDiscordInfo(userId: number, getSession = false) {
	var staff = false;
	var admin = false;
	const memRes = await fetch(`https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}`, {
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

		if (roles.some((r:any) => staffRoles.includes(r))) {
			staff = true;
		} else {
			staff = false;
		}

		if (roles.some((r:any) => adminRoles.includes(r))) {
			admin = true;
		} else {
			admin = false;
		}
		
		roles = roles.filter((r:any) => !ignoredRoles.includes(r));

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
				const matchingObject = role.find((r:any) => r.id === id);
				if (matchingObject && matchingObject.position > highestPosition) {
					highestPosition = matchingObject.position;
					highestPositionID = matchingObject.id;
				}
			}

			const rank = role.find((r:any) => r.id === highestPositionID);

			if (rank) {
				const rankName = extractFirstPart(rank.name);

				if (getSession) {
					return {
						staff: staff,
						admin: admin,
						name: name,
						rank: {
							name: rankName,
							color: rank.color,
							id: rank.id
						}
					}
				}
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

		if (getSession) {
			return {
				staff: staff,
				admin: admin,
				name: name,
				rank: null
			}
		}
		return {
			name: name,
			rank: null
		};
	} else {
		if (getSession) {
			return {
				staff: staff,
				admin: admin,
				name: null,
				rank: null
			}
		}
		return {
			name: null,
			rank: null
		};
	}
}

export const fetcher = (url: string) => fetch(url).then(res => res.json());