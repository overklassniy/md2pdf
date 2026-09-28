import { useMemo } from 'react';
import CodeMirror, { type ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';
import { githubLight } from '@uiw/codemirror-theme-github';
import { imagePaste } from './imagePaste';
import styles from './Editor.module.scss';

export interface CursorPosition {
  line: number;
  column: number;
}

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  /** Called once the underlying EditorView exists (for scroll sync). */
  onViewReady?: (view: EditorView) => void;
  /** Called whenever the cursor moves (for the status bar). */
  onCursorChange?: (pos: CursorPosition) => void;
  /** Pane share of the split container, in percent (0-100). */
  size?: number;
  /** 'row' sizes the pane by width, 'column' by height. */
  layout?: 'row' | 'column';
}

/**
 * Markdown source editor backed by CodeMirror 6.
 *
 * Features: GFM markdown highlighting with fenced-code language support,
 * GitHub light theme, image paste/drop embedding, cursor tracking.
 */
export default function Editor({
  value,
  onChange,
  onViewReady,
  onCursorChange,
  size,
  layout = 'row',
}: EditorProps) {
  const extensions = useMemo(
    () => [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      imagePaste(),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (!onCursorChange || !update.selectionSet) return;
        const head = update.state.selection.main.head;
        const line = update.state.doc.lineAt(head);
        onCursorChange({ line: line.number, column: head - line.from + 1 });
      }),
    ],
    [onCursorChange],
  );

  const handleChange: ReactCodeMirrorProps['onChange'] = (next) => {
    onChange(next);
  };

  const paneStyle: React.CSSProperties =
    layout === 'column'
      ? { width: '100%', height: size !== undefined ? `${size}%` : undefined }
      : { width: size !== undefined ? `${size}%` : undefined };

  return (
    <div className={styles.editor} style={paneStyle}>
      <CodeMirror
        value={value}
        onChange={handleChange}
        onCreateEditor={(view) => onViewReady?.(view)}
        extensions={extensions}
        theme={githubLight}
        height="100%"
        basicSetup={{ lineNumbers: true, foldGutter: false }}
        className={styles.codemirror}
      />
    </div>
  );
}
