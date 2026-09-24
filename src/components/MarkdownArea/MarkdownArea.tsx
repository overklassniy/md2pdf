import { memo, useCallback, useRef, useState } from 'react';
import type { EditorView } from '@codemirror/view';
import Editor, { type CursorPosition } from '../Editor/Editor';
import { insertImageFile } from '../Editor/imagePaste';
import DragBar from '../Editor/DragBar';
import PreviewArea from '../Preview/PreviewArea';
import { useApp } from '../../state/context';
import { useDrop } from '../../hooks/useDrop';
import { useScrollSync } from '../../hooks/useScrollSync';

interface MarkdownAreaProps {
  onCursorChange: (pos: CursorPosition) => void;
  /** Ref that receives the scrolling preview wrapper element. */
  previewRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Split view hosting the editor, the drag handle and the preview pane.
 * Wires file drop loading and proportional scroll sync.
 *
 * Memoized: cursor updates in App would otherwise re-render the whole
 * subtree — including a full react-markdown pass — on every arrow key.
 */
function MarkdownArea({ onCursorChange, previewRef }: MarkdownAreaProps) {
  const { text, setText, scrollSync } = useApp();
  const [isDrag, setDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [width, setWidth] = useState(() => window.innerWidth / 2);
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

  const onDragStart = useCallback((offsetX: number) => {
    setDrag(true);
    setStartX(offsetX);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDrag) return;
    setWidth(e.nativeEvent.pageX - startX);
  };

  return (
    <div
      ref={areaRef}
      className="app__main"
      style={{ opacity: isOver ? 0.5 : 1 }}
      onMouseMove={onMouseMove}
      onMouseUp={() => setDrag(false)}
      onMouseLeave={() => setDrag(false)}
    >
      <div className="no-print" style={{ display: 'contents' }}>
        <Editor
          value={text}
          onChange={setText}
          onViewReady={setEditorView}
          onCursorChange={onCursorChange}
          width={width}
        />
      </div>
      <DragBar isDrag={isDrag} onDragStart={onDragStart} />
      <PreviewArea ref={previewRef} source={text} />
    </div>
  );
}

export default memo(MarkdownArea);
