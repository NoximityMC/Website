'use client'

import { Loading } from "@/app/lib/Loading";
import { useSession } from "@/app/lib/next-auth-react-query";
import { notFound } from "next/navigation";


export default function News({ params }: { params: { slug: string } }) {
	const [session, loading] = useSession({
		required: false,
		redirectTo: '/api/auth/signin?callbackUrl=/client',
		queryConfig: {
		  staleTime: 60 * 1000 * 60 * 3, // 3 hours,
		  refetchInterval: 60 * 1000 * 5, // 5 minutes
		}
	})

	if (loading) {
		return (
			<Loading />
		)
	}

	// return notFound();

	return (
		<div>
			<main className="styles.main">
				<h1>News</h1>
				<p>News slug: {params.slug}</p>
			</main>
		</div>
	)
}