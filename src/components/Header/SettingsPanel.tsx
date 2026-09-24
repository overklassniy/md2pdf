import Dropdown from './Dropdown';
import { type PageSettings } from '../../export/pageSettings';
import styles from './Header.module.scss';

interface SettingsPanelProps {
  settings: PageSettings;
  onChange: (settings: PageSettings) => void;
}

/**
 * Page setup panel controlling @page rules and paged.js pagination.
 *
 * @param props.settings current page settings.
 * @param props.onChange called with the full updated settings object.
 */
export default function SettingsPanel({
  settings,
  onChange,
}: SettingsPanelProps) {
  const update = (patch: Partial<PageSettings>) =>
    onChange({ ...settings, ...patch });

  return (
    <Dropdown label="Page setup">
      <label className={styles.field}>
        <span>Format</span>
        <select
          value={settings.format}
          onChange={(e) =>
            update({ format: e.target.value as PageSettings['format'] })
          }
        >
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
          <option value="Legal">Legal</option>
        </select>
      </label>

      <label className={styles.field}>
        <span>Orientation</span>
        <select
          value={settings.orientation}
          onChange={(e) =>
            update({
              orientation: e.target.value as PageSettings['orientation'],
            })
          }
        >
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </label>

      <label className={styles.field}>
        <span>Margins</span>
        <select
          value={settings.margin}
          onChange={(e) =>
            update({ margin: e.target.value as PageSettings['margin'] })
          }
        >
          <option value="none">None</option>
          <option value="narrow">Narrow</option>
          <option value="normal">Normal</option>
          <option value="wide">Wide</option>
        </select>
      </label>

      <label className={styles.check}>
        <input
          type="checkbox"
          checked={settings.paged}
          onChange={(e) => update({ paged: e.target.checked })}
        />
        <span>Advanced pagination (page numbers, headers)</span>
      </label>

      {settings.paged && (
        <>
          <label className={styles.field}>
            <span>Running header</span>
            <input
              type="text"
              value={settings.headerText}
              placeholder="e.g. My resume"
              onChange={(e) => update({ headerText: e.target.value })}
            />
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={settings.pageNumbers}
              onChange={(e) => update({ pageNumbers: e.target.checked })}
            />
            <span>Page numbers</span>
          </label>
        </>
      )}
    </Dropdown>
  );
}
