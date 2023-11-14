'use client'

import styles from '../style/main.module.scss';
import { useSession } from '../lib/next-auth-react-query'
import { Avatar, Button, Card, CardBody, CardHeader, Divider, Spacer, Tab, Tabs, ringClasses } from '@nextui-org/react';
import md5 from 'md5';
import { useRouter } from 'next/navigation';

export default function Profile({searchParams}: {searchParams: any}) {
  	const [session, loading, refetch] = useSession({
		required: false,
		redirectTo: '/',
		queryConfig: {
	  		staleTime: 60 * 1000 * 60 * 3, // 3 hours,
	  		refetchInterval: 60 * 1000 * 5, // 5 minutes
		}
  	})

	const hash = md5(session.user.email);
	const avatar = `https://www.gravatar.com/avatar/${hash}`;

	const router = useRouter();

  	return (
		<main className={styles.main}>
			<div className='flex w-full flex-col'>
				<Tabs aria-label='options' style={{ justifyContent: 'center' }}>
					<Tab key={"profile"} title={"Profile"}>
						<Card>
							<CardHeader className="justify-between">
								<div className="flex gap-5">
									<Avatar isBordered radius="full" size="lg" style={{ marginRight: '10px' }} src={avatar} />
									<div className="flex flex-col items-start justify-center">
										<h4 className="text-large font-semibold leading-none text-default-600">{session.user.username}</h4>
										<h5 className="text-large tracking-tight text-default-400">{session.user.email}</h5>
									</div>
								</div>
							</CardHeader>
							<CardBody>
								<div className='text-large font-bold'>
									Connected Accounts
								</div>
								<Spacer />
								<Card>
									<CardHeader className='justify-between'>
										<div className='flex gap-5'>
											<i className="fa-brands fa-discord" style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}></i>
											<div className="flex flex-col items-start justify-center">
												<h4 className="text-large font-semibold leading-none text-default-600">Discord</h4>
											</div>
										</div>
									</CardHeader>
									<CardBody>
										<div className='flex'>
											<div className="flex justify-between" style={{ width: '100%' }}>
												<h4 className="flex items-center text-medium font-semibold leading-none text-default-600">{session.user.discord ? session.user.discord.id : 'Not Connected'}</h4>
												<Button onClick={function() {
													if (session.user.discord) {

													} else {
														router.push('https://discord.com/api/oauth2/authorize?client_id=1159900468353437736&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fdiscord&response_type=code&scope=identify%20email')
													}
												}}>{session.user.discord ? 'Unlink' : 'Link'}</Button>
											</div>
										</div>
									</CardBody>
								</Card>
									<div>
									</div>
								<Divider />
							</CardBody>
						</Card> 
					</Tab>
				</Tabs>
			</div>
		</main>
  	)
}
