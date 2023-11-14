import styles from './style/main.module.scss';
import News from './components/News';
import { Alerts } from './components/Alerts';

export default async function Home({searchParams}: {searchParams: any}) {

	const code = searchParams.code || null;
	const extra = searchParams.extra || null;

  	return (
		<>
	  		<main className={styles.main}>
				<Alerts code={code} extra={extra} />
				<News />
	  		</main>
		</>
  	)
}