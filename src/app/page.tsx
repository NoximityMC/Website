import { getServerSession } from "next-auth/next";
import { options } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const session = await getServerSession(options)
  return (
    <>
      <main className="styles.main">
      </main>
    </>
  )
}
