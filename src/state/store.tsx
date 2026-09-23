import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_PAGE_SETTINGS,
  type PageSettings,
} from '../print/pageSettings';
import { loadPersistedState, persistState } from './persistence';
import { SAMPLE_DOCUMENT } from '../sample';
import { AppContext, type AppContextValue } from './context';

const PERSIST_DEBOUNCE_MS = 300;

/**
 * Provides the shared document state: markdown source, page settings and UI
 * toggles. State is persisted to localStorage with a short debounce.
 *
 * @param props.children subtree that can access the store.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [text, setText] = useState<string>(
    () => loadPersistedState().text ?? SAMPLE_DOCUMENT,
  );
  const [settings, setSettings] = useState<PageSettings>(() => ({
    ...DEFAULT_PAGE_SETTINGS,
    ...loadPersistedState().settings,
  }));
  const [scrollSync, setScrollSync] = useState(true);
  const persistTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearTimeout(persistTimer.current);
    persistTimer.current = window.setTimeout(() => {
      persistState({ text, settings });
    }, PERSIST_DEBOUNCE_MS);
    return () => window.clearTimeout(persistTimer.current);
  }, [text, settings]);

  const resetDocument = useCallback(() => setText(SAMPLE_DOCUMENT), []);

  const value = useMemo<AppContextValue>(
    () => ({
      text,
      setText,
      settings,
      setSettings,
      scrollSync,
      setScrollSync,
      resetDocument,
    }),
    [text, settings, scrollSync, resetDocument],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
