import Dropdown from './Dropdown';
import styles from './Header.module.scss';

interface ExportMenuProps {
  onPrint: () => void;
  onExportMd: () => void;
  onExportHtml: () => void;
}

/**
 * Export actions: a direct print-to-PDF button plus a dropdown with raw
 * file downloads.
 */
export default function ExportMenu({
  onPrint,
  onExportMd,
  onExportHtml,
}: ExportMenuProps) {
  return (
    <>
      <button type="button" className={styles.button} onClick={onPrint}>
        Print / Save as PDF
      </button>
      <Dropdown label="Download">
        <button type="button" className={styles.item} onClick={onExportMd}>
          Download .md
        </button>
        <button type="button" className={styles.item} onClick={onExportHtml}>
          Download .html
        </button>
      </Dropdown>
    </>
  );
}
