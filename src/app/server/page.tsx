import { options } from "../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import UserCard from "../components/usercard"

export default async function ServerPage() {
	const session = await getServerSession(options)

	if (!session) {
		redirect('/api/auth/signin?callbackUrl=/server')
	}
	return (
		<UserCard user={session?.user} pagetype={"Server"} />
	)
}