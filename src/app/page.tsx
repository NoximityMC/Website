import { getServerSession } from "next-auth/next";
import { options } from "./api/auth/[...nextauth]/options";
import styles from './style/main.module.scss';
import { NewsItem } from "./components/NewsItem";

export default async function Home() {
  const newsRes = await fetch(`${process.env.NEXTAUTH_URL}/api/news`, {
    cache: 'no-store'
  })
  
  if (!newsRes.ok) {
    return (
      <>
      <main className={styles.main}>
        <div className={styles.mainInner}>
          <h1>Latest News</h1>
          <h2>Error fetching news</h2>
        </div>
      </main>
    </>
    )
  }

  var news = await newsRes.json();

  news = news.slice(0, 5);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.mainInner}>
          <h1>Latest News</h1>
          <div className={styles.newMain}>
            {news.map((item:any) => {
              return (
                <NewsItem key={item.id} news={item} />
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
