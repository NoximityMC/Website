import styles from "../style/footer.module.scss"

export const Footer = () => {

    return (
        <div className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.footerColumns}>
                    <div className={styles.footerColumn}>
                        Testing One
                    </div>
                    <div className={styles.footerColumn}>
                        Testing Two
                    </div>
                    <div className={styles.footerColumn}>
                        Testing Three
                    </div>
                    <div className={styles.footerColumn}>
                        Testing Four
                    </div>
                </div>
            </div>
            <div className={styles.footerLower}>
                <div className={styles.footerInner}>
                    <div className={styles.footerCopyright}>
                        © 2023 Noximity D.o.o. All Rights Reserved.
                    </div>
                </div>
            </div>
        </div>
    )
}