import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthProvider from './context/AuthProvider'
import './globals.css'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes'
import { MainComponent } from './components/MainComponent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  	title: 'Noximity', 
  	description: 'Official Noximity website',
}

export default function RootLayout({
  	children,
}: {
  	children: React.ReactNode
}) {
	return (
		<html lang="en" className='dark'>
	  		<body className={inter.className}>
				<Theme appearance='dark'>
					<AuthProvider>
						<MainComponent>
							{children}
						</MainComponent>
					</AuthProvider>
				</Theme>
			</body>
		</html>
	);
}