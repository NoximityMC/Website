import ReactMarkdown from "react-markdown"
import styles from "../style/main.module.scss"
import parse from 'html-react-parser'
import { getDiscordInfo } from "../lib/misc";
import moment from 'moment-timezone';

export const NewsItem = async ({news} : {news: any}) => {
    var content = news.content;
    if (content.includes('&lt;stop&gt;')) {
        content = content.split('&lt;stop&gt;')[0];
    }

    const author = await getDiscordInfo(news.authorId);

    const dateObject = moment(news.createdAt);

    var formattedDate = dateObject.fromNow();

    const now = moment();
    const diffInDays = now.diff(dateObject, 'days');

    if (diffInDays >= 1 && diffInDays < 7) {
        formattedDate = dateObject.format('dddd [at] hh:mm A'); // Weekday at time
    } else if (diffInDays >= 7) {
        formattedDate = dateObject.format('MMM D, YYYY'); // Short month day, year
    }

    return (
        <div className={styles.newsContainer}>
            <div className={styles.newsContainerInner}>
                <h2 className={styles.newsHeader}>
                    <time title={dateObject.format('MMM D, YYYY [at] hh:mm A')} style={{ float: 'right' }}>{formattedDate}</time>
                    <a href="/">{news.title}</a>
                </h2>
                <div className={styles.newsBody + ' ' + styles.newsRow}>
                    <div className={styles.contentWrapper}>
                        {parse(content)}
                    </div>
                    <a href="/" className={styles.button} style={{ float: 'right' }}>Continue reading...</a>
                </div>
                <div className={styles.newsFooter}>
                    by <a href="/">{author.name}</a> at <time>{dateObject.format('hh:mm A')}</time>
                </div>
            </div>
        </div>
    )
}