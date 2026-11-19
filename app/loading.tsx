import styles from '@/styles/Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingContainer} aria-live="polite" aria-busy="true">
      <div className={styles.spinnerWrapper}>
        <div className={styles.vscodeSpinner} />
        <span className={styles.loadingText}>
          Loading file<span className={styles.loadingDots}>...</span>
        </span>
      </div>
    </div>
  );
}
