import styles from './Loader.module.css'
const LoaderComponent = () => (
    <div className={styles.container}>
        <div className={styles.boxLoader}>
            <div className={styles.wrapper}>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.shadow}></div>
                <div className={styles.shadow}></div>
                <div className={styles.shadow}></div>
            </div>
        </div>
        <p className={'text-2xl font-bold text-white dark:text-black'}>Cargando</p>
    </div>
)
export default LoaderComponent
