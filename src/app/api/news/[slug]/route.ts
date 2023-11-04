import { isAuthorized } from "@/app/lib/misc";
import { NextResponse } from "next/server";

export async function GET(req:any, {params}: any) {
	const auth = await isAuthorized(req);
	if (!auth) {
		return NextResponse.json({success: false, message: 'Unauthorized'}, { status: 403})
	}

	return NextResponse.json({data: 'test'}, { status: 200});
}