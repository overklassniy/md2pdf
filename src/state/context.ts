import { createContext, useContext } from 'react';
import type { PageSettings } from '../print/pageSettings';

export interface AppContextValue {
  text: string;
  setText: (text: string) => void;
  settings: PageSettings;
  setSettings: (settings: PageSettings) => void;
  scrollSync: boolean;
  setScrollSync: (enabled: boolean) => void;
  resetDocument: () => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

/**
 * Accesses the shared document store.
 *
 * @returns the app context value.
 * @throws when used outside AppProvider.
 */
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
