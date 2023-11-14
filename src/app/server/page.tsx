import { options } from "../api/auth/[...nextauth]/discord_options"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import UserCard from "../components/usercard"

export default async function ServerPage() {
	const session = await getServerSession(options)

	if (!session) {
		redirect('/')
	}
	return (
		<UserCard user={session?.user} pagetype={"Server"} />
	)
}