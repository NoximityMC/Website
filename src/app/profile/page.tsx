'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import UserCard from '../components/usercard'


export default function Profile() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/profile')
    }
  })




  return (
    <main className="styles.main">
      <UserCard user={session?.user} pagetype={"Client"} />
    </main>
  )
}
