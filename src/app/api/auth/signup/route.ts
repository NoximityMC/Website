import { db } from "@/app/lib/db";
import { isAuthorized } from "@/app/lib/misc";
import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import * as uuid from 'uuid';
import jwt from 'jsonwebtoken';
import { verificationEmailHTML } from "@/emails/verification";

export async function POST(req:any, res:any) {
	const auth = await isAuthorized(req, false);
	if (!auth) {
		return NextResponse.json({success: false, message: 'Unauthorized'}, { status: 403})
	}

	const data = await req.json();

	const newUUID = uuid.v4();
	const [created, id] = await db.users.create(newUUID, data.username, data.email, data.password);
	if (created) {
		const transport = createTransport({
			host: process.env.SMTP_HOST,
			port: parseInt(process.env.SMTP_PORT || ''),
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS
			}
		})

		const emailSecret = process.env.EMAIL_SECRET || '';

		jwt.sign({ user: id}, emailSecret, { expiresIn: '1d' }, (err, emailToken) => {
			const url = `${process.env.NEXTAUTH_URL}/api/auth/confirmation/${emailToken}`
			transport.sendMail({
				from: 'Noximity <noreply@noximity.com>',
				to: data.email,
				subject: 'Noximity - Verify your email',
				html: verificationEmailHTML(url)
			})
		})

		return NextResponse.json({success: true}, { status: 200 })
	}

	return NextResponse.json({success: false, message: "There was an error creating the user"}, { status: 400 })
}