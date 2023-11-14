import { db } from "@/app/lib/db";
import { isAuthorized } from "@/app/lib/misc";
import { NextResponse } from "next/server";

export async function GET(req:any, {params}: any) {
	const auth = await isAuthorized(req);
	if (!auth) {
		return NextResponse.json({success: false, message: 'Unauthorized'}, { status: 403})
	}

	if (!params.slug) {
		return NextResponse.json({success: false, message: 'Missing one or more fields'}, { status: 400 })
	}

	const profile = await db.users.profile.get.username(params.slug)

	if (profile) {
		return NextResponse.json({success: true, player: {
			id: profile.uuid,
			name: profile.username
		}}, { status: 200 })
	} else {
		return NextResponse.json({success: true, player: null}, { status: 200 })
	}
}