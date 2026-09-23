import UploadButton from './UploadButton';
import ExportMenu from './ExportMenu';
import SettingsPanel from './SettingsPanel';
import { useApp } from '../../state/context';
import { printDocument } from '../../export/print';
import { exportHtml, exportMarkdown } from '../../export/exportFile';
import styles from './Header.module.scss';

interface HeaderProps {
  /** Resolves the live .markdown-body element for export actions. */
  getPreviewEl: () => HTMLElement | null;
}

/**
 * Application header: branding, file loading, export actions, page setup
 * and document reset.
 *
 * @param props.getPreviewEl returns the rendered preview element.
 */
export default function Header({ getPreviewEl }: HeaderProps) {
  const {
    text,
    setText,
    settings,
    setSettings,
    scrollSync,
    setScrollSync,
    resetDocument,
  } = useApp();

  const onPrint = () => {
    const previewEl = getPreviewEl();
    if (!previewEl) return;
    printDocument({ source: text, previewEl, settings }).catch((err) => {
      console.error('Print failed', err);
      window.print();
    });
  };

  const onExportHtml = () => {
    const previewEl = getPreviewEl();
    if (previewEl) exportHtml(previewEl, text);
  };

  const onReset = () => {
    if (window.confirm('Reset the document to the sample?')) {
      resetDocument();
    }
  };

  return (
    <header className={`${styles.header} no-print`}>
      <p className={styles.project}>md2pdf</p>
      <iframe
        title="github-button"
        className={styles.project}
        style={{ display: 'block' }}
        src="https://ghbtns.com/github-btn.html?user=overklassniy&repo=md2pdf&type=star&count=true"
        frameBorder="0"
        scrolling="0"
        width="100px"
        height="20px"
      />

      <div className={styles.menu}>
        <UploadButton onFile={setText} />

        <label className={styles.check} title="Sync editor and preview scroll">
          <input
            type="checkbox"
            checked={scrollSync}
            onChange={(e) => setScrollSync(e.target.checked)}
          />
          <span>Sync scroll</span>
        </label>

        <button type="button" className={styles.button} onClick={onReset}>
          Reset
        </button>

        <SettingsPanel settings={settings} onChange={setSettings} />
        <ExportMenu
          onPrint={onPrint}
          onExportMd={() => exportMarkdown(text)}
          onExportHtml={onExportHtml}
        />
      </div>
    </header>
  );
}
