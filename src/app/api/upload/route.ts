import { isAuthorized } from "@/app/lib/misc";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(req:NextRequest, {params}: any) {
    const auth = await isAuthorized(req);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const form = new FormData();
    form.append('fileToUpload', file);

    const fetchRes = await fetch('https://assets.termanator1128.xyz/upload.php', {
        method: 'POST',
        body: form,
    })

    if (!fetchRes.ok) {
        return NextResponse.json({ error: fetchRes.statusText }, { status: fetchRes.status });
    }

    const res = await fetchRes.text();

    return NextResponse.json({ success: true, location: res }, { status: 200 });
}