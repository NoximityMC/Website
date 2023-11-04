
import { query } from "@/app/lib/db";
import { isAuthorized } from "@/app/lib/misc";
import { NextResponse } from "next/server";

export async function GET(req:any, {params}: any) {
	const auth = await isAuthorized(req);
	if (!auth) {
		return NextResponse.json({success: false, message: 'Unauthorized'}, { status: 403})
	}
	const data = await query('SELECT * FROM news ORDER BY `createdAt` DESC');

	return NextResponse.json({ success: true, data: data }, { status: 200});
}