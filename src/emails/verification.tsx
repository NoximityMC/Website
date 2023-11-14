import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Body } from '@react-email/body';
import { Button } from "@react-email/button";
import { Container } from '@react-email/container';
import { Img } from '@react-email/img';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { render } from '@react-email/render'

function VerificationEmail({url}: {url: string}) {
	return (
		<Html>
			<Head />
			<Preview>
				Verify your email address to continue setting up your Noximity account.
			</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={{
						backgroundColor: '#ffffff',
						color: '#202123',
						padding: '27px 20px 0 15px'
					}}>
						<Text style={{
							textAlign: 'left',
							margin: '0'
						}}>
							<Img
								src={`https://i.term.wtf/mOLO2/ZAVUBIrI84.png/raw`}
								width="140"
								height="auto"
								alt="Noximity"
								style={logo}
							/>
						</Text>
					</Section>
					<Section style={{
						backgroundColor: '#ffffff',
						color: '#353740',
						padding: '40px 20px',
						textAlign: 'left',
						lineHeight: '1.5'
					}}>
						<Text style={{
							color: '#202123',
							fontSize: '32px',
							lineHeight: '40px',
							margin: '0 0 20px'
						}}>
							Verify your email address
						</Text>
						<Text style={{
							fontSize: '16px',
							lineHeight: '24px'
						}}>
							To continue setting up your Noximity account, please verify that this is your email address.
						</Text>
						<Text style={{
							margin: '24px 0 0',
							textAlign: 'left'
						}}>
							<Button style={{
								display: 'inline-block',
								textDecoration: 'none',
								background: '#C43455',
								borderRadius: '3px',
								color: 'white',
								fontFamily: 'Helvetica,sans-serif',
								fontSize: '16px',
								lineHeight: '24px',
								fontWeight: '400',
								padding: '12px 20px 11px',
								margin: '0px'
							}} href={url}>
								Verify email address
							</Button>
						</Text>
					</Section>
					<Section style={{
						textAlign: 'left',
						background: '#ffffff',
						color: '#6e6e80',
						padding: '0 20px 20px',
						fontSize: '13px',
						lineHeight: '1.4'
					}}>
						<Text style={{
							margin: '0'
						}}>
							This link will expire in 1 day. If you did not make this request, please disregard this email.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	)
}

const main = {
	backgroundColor: '#ffffff',
	fontFamily:
	'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: '0 auto',
	padding: '20px 0 48px',
};

const logo = {
	margin: '0 auto',
};

export function verificationEmailHTML(url: string) {
	return render(<VerificationEmail url={url} />)
}