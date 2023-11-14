import { isAuthorized } from "@/app/lib/misc";
import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";

export async function GET(req:any, {params}: any) {
	if (!process.env.DEV) {
		return NextResponse.json({}, { status: 404 })
	}
	const auth = await isAuthorized(req);
	if (!auth) {
		return NextResponse.json({success: false, message: 'Unauthorized'}, { status: 403})
	}

	const transport = createTransport({
		host: process.env.SMTP_HOST,
		port: parseInt(process.env.SMTP_PORT || ''),
		secure: true,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS
		}
	})

	const info = await transport.sendMail({
		from: 'Noximity NoReply <noreply@noximity.com>',
		to: 'brennenstapleton@gmail.com',
		subject: 'Test',
		text: 'Text',
		html: '<b>Hello</b>'
	})

	console.log("Message sent: %s", info.messageId);

	return NextResponse.json({success: true}, { status: 200 })
}