import { query } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req:any, { params }: any) {
    const data = await query('SELECT * FROM api_keys WHERE `key` = ?', [params.slug]);
    if (data.length === 0) {
        return NextResponse.json({success: false, message: 'Key not found'}, { status: 404 })
    }
    return NextResponse.json({success: true, data: data[0] }, { status: 200 })
}