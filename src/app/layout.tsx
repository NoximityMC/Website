import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthProvider from './context/AuthProvider'
import './globals.css'
import '@radix-ui/themes/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Theme } from '@radix-ui/themes'
import { MainComponent } from './components/MainComponent'
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fab, fas, far);

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
			<head>
			<link
				rel="stylesheet"
				href="https://site-assets.fontawesome.com/releases/v6.4.2/css/all.css"
			/>

			<link
				rel="stylesheet"
				href="https://site-assets.fontawesome.com/releases/v6.4.2/css/sharp-solid.css"
			/>

			<link
				rel="stylesheet"
				href="https://site-assets.fontawesome.com/releases/v6.4.2/css/sharp-regular.css"
			/>

			<link
				rel="stylesheet"
				href="https://site-assets.fontawesome.com/releases/v6.4.2/css/sharp-light.css"
			/>
			</head>
	  		<body className={inter.className}>
				<Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
					<Theme appearance='dark'>
						<AuthProvider>
							<ToastContainer
								theme='dark'
								newestOnTop={true}
								closeButton={false}
							/>
							<MainComponent>
								{children}
							</MainComponent>
						</AuthProvider>
					</Theme>
				</Providers>
			</body>
		</html>
	);
}