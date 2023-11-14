'use client'

import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { GoPerson, GoShieldLock, GoSignOut, GoSignIn, GoEye, GoEyeClosed } from "react-icons/go";
import logo from '../assets/logos/FullLogo.svg';
import styles from '../style/navbar.module.scss';
import NavBarLogin from './navbarlogin';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Session } from 'next-auth';
import { AuthCheck, checkPassword, hashPassword } from '../lib/misc';
import { Button, Checkbox, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress, Spacer, Spinner, useDisclosure } from '@nextui-org/react'
import ReCAPTCHA from "react-google-recaptcha"
import { verifyCaptcha } from '../lib/ServerActions';
import { useRef, useState } from 'react';
import { Form, Formik } from "formik";
import { toast } from 'react-toastify';
import { words } from "../words"

const defaultDataSignUp = {
	username: '',
	email: '',
	password: '',
	captcha: false,
	tos: false
}

const defaultDataSignIn = {
	email: '',
	password: ''
}

export default function Navbar({session}: {session: Session}) {
	const {isOpen: isOpenSignIn, onOpen: onOpenSignIn, onOpenChange: onOpenChangeSignIn} = useDisclosure();
	const {isOpen: isOpenSignUp, onOpen: onOpenSignUp, onOpenChange: onOpenChangeSignUp} = useDisclosure();

	const recaptchaRef = useRef<ReCAPTCHA>(null)

	const [passVisible, setPassVisible] = useState(false);
	const [pswdScore, setPSWDScore] = useState(0);
	const [pswdColor, setPSWDColor] = useState<"danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined>('danger');

	const router = useRouter();

	const handleSignInFormValidate = async (values: typeof defaultDataSignIn) => {
		const errors: Record<string, string> = {};

		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if (!emailRegex.test(values.email)) {
			errors.email = 'Please enter a valid email.'
		}

		return errors;
	}

	const handleSignUpFormValidate = async (values: typeof defaultDataSignUp) => {
		const errors: Record<string, string> = {};

		if (values.username.length > 0 && values.username.length < 3) {
			errors.username = 'Please enter a name that is at least 3 characters long.'
		}

		const pattern = /^[a-zA-Z0-9_]+$/;
		if (!pattern.test(values.username)) {
			errors.username = 'Please enter another name. The entered value does not match the required format.'
		} else {
			const regex = new RegExp(words.join("|"), "i");
			if (regex.test(values.username)) {
				errors.username = 'Please enter another name. The entered value contains disallowed words.'
			} else {
				const profileReq = await fetch('/api/users/profiles/' + values.username)
		
				if (profileReq.ok) {
					const profile = await profileReq.json();
					if (profile.player) {
						errors.username = 'Usernames must be unique. The specified username is already in use.'
					}
				} else {
					errors.username = 'Error checking username. Please try again.'
				}
			}
		}

		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if (!emailRegex.test(values.email)) {
			errors.email = 'Please enter a valid email.'
		} else {
			const emailReq = await fetch('/api/internal/email/' + values.email)
	
			if (emailReq.ok) {
				const email = await emailReq.json();
				if (email.exists) {
					errors.email = 'Email addresses must be unique. The specified email address is already in use.'
				}
			} else {
				errors.email = 'Error checking email. Please try again.'
			}
		}


		if (!values.password.trim() || values.password.trim().length < 8) {
			errors.password = 'Password must be at least 8 characters long.'
		} else {
			const pswd = checkPassword(values.password);
			if (pswd.score < 3) {
				errors.password = 'Your password is too weak.'
				const score = pswd.score + 1;
				setPSWDScore(score * 20);
				setPSWDColor(score < 2 ? 'danger' : score < 4 ? 'warning' : 'success')
			}
		}

		if (!values.captcha) {
			errors.captcha = 'You did not complete the CAPTCHA verification properly. Please try again.'
		}

		return errors;
	}

	return (
		<>
			<Modal
				isOpen={isOpenSignUp}
				onOpenChange={onOpenChangeSignUp}
				placeholder='center'
				size='lg'
				onClose={function() {
					setPSWDScore(0);
					setPSWDColor('danger');
					setPassVisible(false);
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className='flex flex-col gap-1'>Sign Up</ModalHeader>
							<ModalBody>
								<Formik
									initialValues={defaultDataSignUp}
									validate={handleSignUpFormValidate}
									validateOnChange={false}
									validateOnBlur={false}
									onSubmit={async (values, { setSubmitting }) => {
										const req = await fetch('api/auth/signup', {
											method: 'POST',
											body: JSON.stringify({
												username: values.username,
												email: values.email,
												password: await hashPassword(values.password)
											}),
										})
										if (req.ok) {
											toast(`A verification email has been sent to ${values.email}.`, {
												position: 'top-center',
												type: 'success'
											})
										} else {
											toast(`There was an erroring signing you up. Please try again or contact administration.`, {
												position: 'top-center',
												type: 'error'
											})
										}
										setTimeout(() => {
											setSubmitting(false);
											onClose();
										}, 250);
									}}
								>
									{({ values, errors, handleChange, isSubmitting, handleSubmit, handleBlur, validateForm, setFieldValue }) => {
										return (
											<Form autoComplete='off' onSubmit={handleSubmit}>
												<Input
													isRequired
													name='username'
													label="Username"
													placeholder='Enter your username'
													value={values?.username}
													isInvalid={errors?.username ? true : false}
													color={errors?.username ? "danger" : "default"}
													errorMessage={errors?.username}
													onChange={async function(e) {
														handleChange(e);
														const value = e.target.value;
														if (value.length > 0 && value.length < 3) {
															return errors.username = 'Please enter a name that is at least 3 characters long.'
														}

														const pattern = /^[a-zA-Z0-9_]+$/;
														if (!pattern.test(value)) {
															return errors.username = 'Please enter another name. The entered value does not match the required format.'
														}

														const regex = new RegExp(words.join("|"), "i");
														if (regex.test(value)) {
															return errors.username = 'Please enter another name. The entered value contains disallowed words.'
														}

														return errors.username = '';
													}}
													onBlur={handleBlur}
													variant='bordered'
													maxLength={16}
													minLength={3}
												/>
												<Spacer y={errors?.username ? 5 : 1} />
												<Input
													isRequired
													name='email'
													label="Email"
													placeholder='Enter your email'
													value={values?.email}
													isInvalid={errors?.email ? true : false}
													color={errors?.email ? "danger" : "default"}
													errorMessage={errors?.email}
													onChange={handleChange}
													onBlur={handleBlur}
													variant='bordered'
												/>
												<Spacer y={errors?.email ? 5 : 1} />
												<Input
													isRequired
													type={passVisible ? 'text' : 'password'}
													name='password'
													label="Password"
													placeholder='Enter your password'
													value={values?.password}
													isInvalid={errors?.password ? true : false}
													color={errors?.password ? "danger" : "default"}
													errorMessage={errors?.password}
													onChange={async function(e) {
														handleChange(e);
														const value = e.target.value;
														if (value.length > 0) {
															const pswd = checkPassword(value);
															const score = pswd.score + 1;
															setPSWDScore(score * 20);
															setPSWDColor(score < 2 ? 'danger' : score < 4 ? 'warning' : 'success')
															errors.password = pswd.feedback.warning || '';
														} else {
															setPSWDScore(0);
															errors.password = 'Entering a password is required.'
														}
													}}
													onBlur={handleBlur}
													variant='bordered'
													endContent={
														<button className="focus:outline-none" type="button" onClick={function() {
															setPassVisible(!passVisible)
														}}>
															{passVisible ? (
																<GoEyeClosed className="text-2xl text-default-400 pointer-events-none" />
															) : (
																<GoEye className="text-2xl text-default-400 pointer-events-none" />
															)}
														</button>
													}
													minLength={8}
												/>
												<Spacer y={errors?.password ? 5 : 1} />
												<Progress
													minValue={0}
													maxValue={100}
													value={pswdScore}
													showValueLabel={true}
													color={pswdColor}
													aria-label='password-strength'
												/>
												<Spacer y={1} />
												<div className="py-2 px-1">
													<ReCAPTCHA
														sitekey={'6Lfn4PooAAAAAIdgp_1-i1X2zqHUfTOIBr0ve2BT'}
														ref={recaptchaRef}
														onChange={async function(token) {
															await verifyCaptcha(token)
																.then((val) => setFieldValue('captcha', val))
														}}
													/>
													{errors?.captcha && (
														<div data-slot="error-message" className="text-tiny text-danger">{errors?.captcha}</div>
													)}
												</div>
												<Spacer />
												<Checkbox
													isRequired
													name='tos'
													isSelected={values?.tos}
													onChange={handleChange}
													isInvalid={errors?.tos ? true : false}
													color={errors?.tos ? "danger" : "default"}
													
												>
													I agree to the <Link>terms</Link> and <Link>privacy policy</Link>.
												</Checkbox>
												<Spacer />
												{isSubmitting ? (
													<Spinner
														color='current'
														size='sm'
													/>
												) : (
													<Button type='submit' onClick={async function(e) {
														await validateForm();
													}}>
														Register
													</Button>
												)}
											</Form>
										)
									}}
								</Formik>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
			<Modal
				isOpen={isOpenSignIn}
				onOpenChange={onOpenChangeSignIn}
				placeholder='center'
				size='lg'
				onClose={function() {
					setPassVisible(false);
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
							<ModalBody>
								<Formik
									initialValues={defaultDataSignIn}
									validate={handleSignInFormValidate}
									validateOnChange={false}
									validateOnBlur={false}
									onSubmit={async (values, { setSubmitting }) => {
										const email = values.email;
										const password = values.password
										const response = await signIn('credentials', {
											redirect: true,
											email,
											password,
										})
										if (!response?.ok) {
											if (response?.error == 'invalid-user') {
												toast('Incorrect email or password. Please try again.', {
													type: 'error'
												})
												return;
											} else if (response?.error == 'verify-email') {
												toast((
													<>
														<div>Email Not Verified</div>
														<div>Click the button to send verify email</div>
														<button style={{
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
														}} onClick={async function() {
															const req = await fetch('api/internal/email/verify', {
																method: 'POST',
																body: JSON.stringify({
																	email: email
																})
															})
															if (req.ok) {
																toast(`A verification email has been re-sent.`, {
																	position: 'top-center',
																	type: 'success'
																})
															} else {
																toast(`There was an erroring re-sending the email. Please try again or contact administration.`, {
																	position: 'top-center',
																	type: 'error'
																})
															}
														}}>Resend verify email</button>
													</>
												), {
													type: 'error',
													autoClose: false
												})
												return;
											}
											return;
										}
										setSubmitting(false);
										onClose();
									}}
								>
									{({ values, errors, handleChange, isSubmitting, handleSubmit, handleBlur, validateForm, setFieldValue }) => {
										return (
											<Form autoComplete='off' onSubmit={handleSubmit}>
												<Input
													isRequired
													name='email'
													label='Email'
													placeholder='Enter your email'
													value={values?.email}
													isInvalid={errors?.email ? true : false}
													color={errors?.email ? "danger" : "default"}
													errorMessage={errors?.email}
													onChange={handleChange}
													onBlur={handleBlur}
													variant='bordered'
												/>
												<Spacer y={errors?.email ? 5 : 1} />
												<Input
													isRequired
													type={passVisible ? 'text' : 'password'}
													name='password'
													label='Password'
													placeholder='Enter your password'
													value={values?.password}
													isInvalid={errors?.password ? true : false}
													color={errors?.password ? "danger" : "default"}
													errorMessage={errors?.password}
													onChange={handleChange}
													onBlur={handleBlur}
													variant='bordered'
													endContent={
														<button className="focus:outline-none" type="button" onClick={function() {
															setPassVisible(!passVisible)
														}}>
															{passVisible ? (
																<GoEyeClosed className="text-2xl text-default-400 pointer-events-none" />
															) : (
																<GoEye className="text-2xl text-default-400 pointer-events-none" />
															)}
														</button>
													}
												/>
												<Spacer />
												<div className="py-2 px-1">
													<Link color="primary" href="/" size="sm" style={{ float: 'right' }}>
														Forgot password?
													</Link>
												</div>
												{isSubmitting ? (
													<Spinner
														color='current'
														size='sm'
													/>
												) : (
													<Button type='submit' onClick={async function(e) {
														await validateForm();
													}}>
														Log In
													</Button>
												)}
											</Form>
										)
									}}
								</Formik>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
			{session == null ? (
				<nav className={styles.navbar}>
					<div className={styles.left}>
						<Image
							src={logo}
							alt="Noximity"
							width={150}
							height={35}
							priority={true}
							quality={100}
							className={styles.logo}
							onClick={function () {
								router.push("/");
							}}
							style={{ cursor: "pointer" }}
						/>
						<a href="/">VoidBound</a>
					</div>
					<div className={styles.right}>
						{/* <a onClick={() => signIn("discord")} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
							<GoSignIn size="20px" color="#b6afdc" />
							Sign In
						</a> */}
						<a onClick={onOpenSignIn} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
							<GoSignIn size="20px" color="#b6afdc" />
							Sign In
						</a>
						<a onClick={onOpenSignUp} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
							<GoSignIn size="20px" color="#b6afdc" />
							Sign Up
						</a>
					</div>
				</nav>
			) : (
				<nav className={styles.navbar}>
					<div className={styles.left}>
						<Image
							src={logo}
							alt="Noximity"
							width={150}
							height={35}
							priority={true}
							quality={100}
							className={styles.logo}
							onClick={function () {
								router.push("/");
							}}
							style={{ cursor: "pointer" }}
						/>
						<a href="/">Noxlith</a>
					</div>
					<div className={styles.right}>
						<>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger className={styles.trigger}>
									<div id="profile">
										<div>
											<NavBarLogin user={session?.user} pagetype={"Client"} />
										</div>
									</div>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content className={styles.content}>
									<DropdownMenu.Item
										onClick={function () {
											router.push("/profile");
										}}
									>
										<div className={styles.contentIcon}>
											<GoPerson size="20px" color="#b6afdc" />
										</div>
										Profile
									</DropdownMenu.Item>
									{AuthCheck(session, false) ? (
										<DropdownMenu.Item
											onClick={function () {
												router.push("/admin");
											}}
										>
											<div className={styles.contentIcon}>
												<GoShieldLock size="20px" color="#b6afdc" />
											</div>
											Admin
										</DropdownMenu.Item>
									) : null}
									<DropdownMenu.Item
										onClick={function () {
											signOut();
										}}
									>
										<div className={styles.contentIcon}>
											<GoSignOut size="20px" color="#b6afdc" />
										</div>
										Logout
									</DropdownMenu.Item>
									<DropdownMenu.Arrow className={styles.arrow} />
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</>
					</div>
				</nav>
			)}
		</>
	)
}
