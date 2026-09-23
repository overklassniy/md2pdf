import { useMemo } from 'react';
import { useApp } from '../../state/context';
import type { CursorPosition } from '../Editor/Editor';
import styles from './StatusBar.module.scss';

interface StatusBarProps {
  cursor: CursorPosition;
}

const WORD_PATTERN = /\S+/g;

/**
 * Bottom status bar: word/character/line counts and cursor position.
 */
export default function StatusBar({ cursor }: StatusBarProps) {
  const { text } = useApp();

  const stats = useMemo(() => {
    const words = text.match(WORD_PATTERN)?.length ?? 0;
    return {
      words,
      chars: text.length,
      lines: text === '' ? 0 : text.split('\n').length,
    };
  }, [text]);

  return (
    <footer className={`${styles.statusbar} no-print`}>
      <span>{stats.words} words</span>
      <span>{stats.chars} chars</span>
      <span>{stats.lines} lines</span>
      <span className={styles.spacer} />
      <span>
        Ln {cursor.line}, Col {cursor.column}
      </span>
    </footer>
  );
}
