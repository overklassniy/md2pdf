import Dropdown from './Dropdown';
import styles from './Header.module.scss';

interface ExportMenuProps {
  onPrint: () => void;
  onExportMd: () => void;
  onExportHtml: () => void;
}

/**
 * Export actions dropdown: print-to-PDF plus raw file downloads.
 */
export default function ExportMenu({
  onPrint,
  onExportMd,
  onExportHtml,
}: ExportMenuProps) {
  return (
    <Dropdown label="Export">
      <button type="button" className={styles.item} onClick={onPrint}>
        Print / Save as PDF
      </button>
      <button type="button" className={styles.item} onClick={onExportMd}>
        Download .md
      </button>
      <button type="button" className={styles.item} onClick={onExportHtml}>
        Download .html
      </button>
    </Dropdown>
  );
}
