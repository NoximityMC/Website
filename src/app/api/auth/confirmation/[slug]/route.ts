import { db } from '@/app/lib/db';
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server';

export async function GET(req:any, {params}: any) {
	const emailSecret = process.env.EMAIL_SECRET || '';
	try {
		const data = jwt.verify(params.slug, emailSecret);
		const user = await db.users.get.fromId(data.user);

		if (user?.verifiedEmail == 1) {
			return NextResponse.redirect(new URL('/', req.url));	
		}

		const done = await db.users.email.confirm(user?.id);

		if (done) {
			return NextResponse.redirect(new URL('/?code=success-email', req.url));
		}
		
		return NextResponse.redirect(new URL('/?code=error-email', req.url));
	} catch (e) {
		return NextResponse.redirect(new URL('/?code=error-email', req.url));
	}

}