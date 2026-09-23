import { useRef } from 'react';
import styles from './Header.module.scss';

interface UploadButtonProps {
  onFile: (content: string) => void;
}

const ACCEPT = '.md,.markdown,.mdown,.mkd,.txt';

/**
 * File picker button loading a markdown file into the editor.
 *
 * @param props.onFile called with the file's text content.
 */
export default function UploadButton({ onFile }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onFile(String(reader.result ?? ''));
    reader.readAsText(file);
    // Reset so picking the same file twice still fires change.
    e.currentTarget.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        style={{ display: 'none' }}
        onChange={onChange}
        aria-hidden="true"
      />
      <button
        type="button"
        className={styles.button}
        onClick={() => inputRef.current?.click()}
      >
        Choose
      </button>
    </>
  );
}
