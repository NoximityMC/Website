import styles from './style/main.module.scss';
import { NewsItem } from "./components/NewsItem";
import News from './components/News';

export default async function Home() {

  	return (
		<>
	  		<main className={styles.main}>
				<News />
	  		</main>
		</>
  	)
}