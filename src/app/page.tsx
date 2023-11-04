import styles from './style/main.module.scss';
import { NewsItem } from "./components/NewsItem";
import News from './components/News';

export default async function Home() {

  // const newsRes = await fetch(`${process.env.NEXTAUTH_URL}/api/news`, {
  //   cache: 'no-store'
  // })
  
  // if (!newsRes.ok) {
  //   return (
  //     <>
  //     <main className={styles.main}>
  //       <div className={styles.mainInner}>
  //         <h1>Latest News</h1>
  //         <h2>Error fetching news</h2>
  //       </div>
  //     </main>
  //   </>
  //   )
  // }

  // var news = await newsRes.json();

  // news = news.slice(0, 5);

  return (
    <>
      <main className={styles.main}>
        <News />
      </main>
    </>
  )
}
