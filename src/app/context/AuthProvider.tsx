'use client'

import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient();

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            {children}
        </QueryClientProvider>
    )
}