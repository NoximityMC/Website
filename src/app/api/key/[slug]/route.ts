import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req:any, { params }: any) {
	if (!params.slug) {
		return NextResponse.json({success: false, message: 'Missing one or more fields'}, { status: 400 })
	}

	const exists = await db.api.exists(params.slug);
	
	if (exists) {
		return NextResponse.json({success: true }, { status: 200 })
	}
	
	return NextResponse.json({success: false, message: 'Key not found'}, { status: 404 })
}