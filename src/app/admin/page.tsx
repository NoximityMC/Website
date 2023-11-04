'use client'

import { redirect } from 'next/navigation'
import UserCard from '../components/usercard'
import { useSession } from '../lib/next-auth-react-query'
import { Loading } from '../lib/Loading'
import { AuthCheck } from '../lib/misc'
import { CustomEditor } from '../lib/CustomEditor'
import { useEffect, useState } from 'react'


export default function Admin() {
    const [value, setValue] = useState('');
    const [session, loading] = useSession({
        required: false,
        redirectTo: '/api/auth/signin?callbackUrl=/client',
        queryConfig: {
          staleTime: 60 * 1000 * 60 * 3, // 3 hours,
          refetchInterval: 60 * 1000 * 5, // 5 minutes
        }
    })
    
    useEffect(() => {
        console.log(value);
    }, [value])

    if (!AuthCheck(session, false)) {
        return redirect('/');
    }

    if (loading) {
        return (
            <Loading />
        )
    }


    return (
        <main className="styles.main">
            <UserCard user={session?.user} pagetype={"Admin"} />
            <CustomEditor value={value} onChange={setValue} />
        </main>
    )
}
