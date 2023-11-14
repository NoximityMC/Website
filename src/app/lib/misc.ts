import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { compare, hash } from 'bcryptjs';

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

export async function isAuthorized(req:any, keyCheck: boolean = true) {
	const cookies = req.cookies;
	const csrf = cookies.get('next-auth.csrf-token')
	const token = await getToken({req});
	const session = await getSession();
	const apiKey = req.headers.get('api-key');
	if (keyCheck) {
		const keyRes = await fetch(`${process.env.NEXTAUTH_URL}/api/key/${apiKey}`, {
			cache: 'no-store'
		});
		var key = false;
		if (keyRes.ok) {
			var keyJson = await keyRes.json();
			key = keyJson.success;
		}
		return !!csrf || !!token || !!session || !!key;
	} else {
		return !!csrf || !!token || !!session;
	}
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

async function getDiscordToken(code: string): Promise<string> {
	const params = new URLSearchParams()
	params.append('client_id', process.env.DISCORD_CLIENT_ID!)
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET!)
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', `${process.env.NEXTAUTH_URL!}/api/auth/discord`)
    params.append('scope', 'identify');

	const resp = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: params,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json'
		}
	})

	const data = await resp.json();
	return data.access_token;
}


export async function getDiscordId(code: string): Promise<string> {
	const token = await getDiscordToken(code);

	const resp = await fetch('https://discord.com/api/users/@me', {
		method: 'GET',
		headers: {
			"Authorization": `Bearer ${token}`
		}
	})

	const data = await resp.json();
	return data.id;
}

export const fetcher = (url: string) => fetch(url).then(res => res.json());

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

export function checkPassword(pswd: string) {
	return zxcvbn(pswd);
}

export async function hashPassword(password: string) {
	const hashedPassword = await hash(password, 12);
	return hashedPassword;
}

export async function isPasswordValid(password: string, hashedPassword: string) {
	const isValid = await compare(password, hashedPassword);
	return isValid;
}