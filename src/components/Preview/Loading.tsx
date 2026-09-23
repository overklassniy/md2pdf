import styles from './Loading.module.scss';

/**
 * Pulsing placeholder shown while the lazy preview chunk loads.
 */
export default function Loading() {
  return (
    <div className={styles.loading} id="preview-loading">
      <p />
      <p />
      <p />
    </div>
  );
}
