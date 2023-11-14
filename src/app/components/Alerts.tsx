'use client'

import { ReactElement } from "react";
import { TypeOptions, toast, ToastOptions } from "react-toastify";

const codes: {
    [key: string]: {
        message?: string;
		extra?: (data: string | number | null) => JSX.Element;
		options: ToastOptions;
    };
} = {
	'success-email': {
		message: 'Your emailed has been verified.',
		options: {
			type: 'success',
		}
	},
	'error-email': {
		message: 'Could not verify email address. Login to request a new link',
		options: {
			type: 'error'
		}
	},
	// 'error-email-expire': {
	// 	extra: (data: string | number | null) => {
	// 		return (
	// 			<>
	// 				<div>Expired Link.</div>
	// 				<div>Click the button to send another one</div>
	// 				<button style={{
	// 					display: 'inline-block',
	// 					textDecoration: 'none',
	// 					background: '#C43455',
	// 					borderRadius: '3px',
	// 					color: 'white',
	// 					fontFamily: 'Helvetica,sans-serif',
	// 					fontSize: '16px',
	// 					lineHeight: '24px',
	// 					fontWeight: '400',
	// 					padding: '12px 20px 11px',
	// 					margin: '0px'
	// 				}} onClick={async function() {
	// 					const req = await fetch('api/internal/email/verify', {
	// 						method: 'POST',
	// 						body: JSON.stringify({
	// 							id: data
	// 						})
	// 					})
	// 					if (req.ok) {
	// 						toast(`A verification email has been re-sent.`, {
	// 							position: 'top-center',
	// 							type: 'success'
	// 						})
	// 					} else {
	// 						toast(`There was an erroring re-sending the email. Please try again or contact administration.`, {
	// 							position: 'top-center',
	// 							type: 'error'
	// 						})
	// 					}
	// 				}}>Resend verify email</button>
	// 			</>
	// 		)
	// 	},
	// 	options: {
	// 		type: 'error',
	// 		autoClose: false
	// 	}
	// },
}

export const Alerts = ({code, extra}: {code: string | null, extra: string | number}) => {

	if (code) {
		if (codes[code]) {
			const data = codes[code];
			if (extra && data.extra) {
				toast(data.extra(extra), data.options)
			} else {
				toast(data.message, data.options)
			}
			return (
				<></>
			);
		}
	}

	return (
		<></>
	);
}