'use client'
import useSWR from 'swr'
import styles from '../style/main.module.scss';
import { NewsItem } from './NewsItem';
import { fetcher } from '../lib/misc';

export default function News() {
	const { data, error, isLoading } = useSWR('/api/news', fetcher);

  	if (error) return (<></>)
  	if (isLoading) return (<></>)

	const news = data.data.slice(0, 5);

  	return (
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
  	);
}