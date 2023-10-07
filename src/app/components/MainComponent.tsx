"use client";

import { Loading } from "../lib/Loading";
import { useSession } from "../lib/next-auth-react-query"
import Navbar from "./navbar"

export const MainComponent = ({children}: {children: React.ReactNode}) => {
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
    
    return (
        <>
            <Navbar session={session} />
            <main>
                {children}
            </main>
        </>
    )
}