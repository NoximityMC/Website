import { db } from "@/app/lib/db";
import { extractFirstPart, getDiscordId, isAuthorized } from "@/app/lib/misc";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req:any, {params}: any) {
	const session = await getServerSession();
	const auth = await isAuthorized(req, false);
	if (!auth) {
		return NextResponse.redirect(new URL('/', req.url));
	}

	const url = new URL(req.url);
	const code = url.searchParams.get('code');

	if (!code) {
		return NextResponse.redirect(new URL('/profile', req.url));
	}

	if (session && session.user && session.user.email) {
		const id = await getDiscordId(code);
		await db.users.discord.set(session.user?.email, id);
		return NextResponse.redirect(new URL('/profile', req.url));
	}

	return NextResponse.redirect(new URL('/profile', req.url));
}