import { memo, useCallback, useRef, useState } from 'react';
import type { EditorView } from '@codemirror/view';
import Editor, { type CursorPosition } from '../Editor/Editor';
import { insertImageFile } from '../Editor/imagePaste';
import DragBar from '../Editor/DragBar';
import PreviewArea from '../Preview/PreviewArea';
import { useApp } from '../../state/context';
import { useDrop } from '../../hooks/useDrop';
import { useMediaQuery, COMPACT_QUERY } from '../../hooks/useMediaQuery';
import { useScrollSync } from '../../hooks/useScrollSync';

/** Bounds for the editor's share of the split so neither pane collapses. */
const MIN_RATIO = 0.15;
const MAX_RATIO = 0.85;

interface MarkdownAreaProps {
  onCursorChange: (pos: CursorPosition) => void;
  /** Ref that receives the scrolling preview wrapper element. */
  previewRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Split view hosting the editor, the drag handle and the preview pane.
 * Wires file drop loading and proportional scroll sync.
 *
 * Below the compact breakpoint the panes stack vertically (editor over
 * preview) and the divider drags along the Y axis; above it the classic
 * side-by-side layout applies. The split is tracked as a ratio so it
 * survives rotation, resize and layout changes.
 *
 * Memoized: cursor updates in App would otherwise re-render the whole
 * subtree — including a full react-markdown pass — on every arrow key.
 */
function MarkdownArea({ onCursorChange, previewRef }: MarkdownAreaProps) {
  const { text, setText, scrollSync } = useApp();
  const compact = useMediaQuery(COMPACT_QUERY);
  const layout = compact ? 'column' : 'row';
  const [ratio, setRatio] = useState(0.5);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const onText = useCallback((content: string) => setText(content), [setText]);
  // Image drops land wherever the mouse is; posAtCoords resolves to null
  // outside the editor, in which case the image goes to the cursor.
  const onImage = useCallback(
    (file: File, e: DragEvent) => {
      if (!editorView) return;
      const pos = editorView.posAtCoords({ x: e.clientX, y: e.clientY });
      insertImageFile(editorView, file, pos ?? undefined);
    },
    [editorView],
  );
  const [isOver] = useDrop(areaRef, { onText, onImage });

  useScrollSync(editorView, previewRef, scrollSync);

  const onDrag = useCallback(
    (origin: number) => {
      const rect = areaRef.current?.getBoundingClientRect();
      if (!rect) return;
      const start = compact ? rect.top : rect.left;
      const span = compact ? rect.height : rect.width;
      if (span <= 0) return;
      setRatio(
        Math.min(MAX_RATIO, Math.max(MIN_RATIO, (origin - start) / span)),
      );
    },
    [compact],
  );

  return (
    <div
      ref={areaRef}
      className={`app__main${compact ? ' app__main--column' : ''}`}
      style={{ opacity: isOver ? 0.5 : 1 }}
    >
      <div className="no-print" style={{ display: 'contents' }}>
        <Editor
          value={text}
          onChange={setText}
          onViewReady={setEditorView}
          onCursorChange={onCursorChange}
          size={ratio * 100}
          layout={layout}
        />
      </div>
      <DragBar layout={layout} onDrag={onDrag} />
      <PreviewArea ref={previewRef} source={text} />
    </div>
  );
}

export default memo(MarkdownArea);
