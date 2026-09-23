import { useCallback, useRef, useState } from 'react';
import Header from './components/Header/Header';
import MarkdownArea from './components/MarkdownArea';
import StatusBar from './components/StatusBar/StatusBar';
import { AppProvider } from './state/store';
import type { CursorPosition } from './components/Editor/Editor';

/**
 * Application shell: header, editor/preview split, status bar.
 */
export default function App() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<CursorPosition>({ line: 1, column: 1 });

  const getPreviewEl = useCallback(
    () => previewRef.current?.querySelector<HTMLElement>('.preview') ?? null,
    [],
  );

  const onCursorChange = useCallback(
    (pos: CursorPosition) => setCursor(pos),
    [],
  );

  return (
    <AppProvider>
      <div className="app" id="app">
        <Header getPreviewEl={getPreviewEl} />
        <MarkdownArea onCursorChange={onCursorChange} previewRef={previewRef} />
        <StatusBar cursor={cursor} />
      </div>
    </AppProvider>
  );
}
