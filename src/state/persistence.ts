import type { PageSettings } from '../export/pageSettings';

const STORAGE_KEY = 'md2pdf:v1';

interface PersistedState {
  text?: string;
  settings?: Partial<PageSettings>;
}

/**
 * Reads the persisted editor state from localStorage.
 *
 * @returns the stored state, or an empty object when nothing is stored
 * or the payload cannot be parsed.
 */
export function loadPersistedState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed as PersistedState;
  } catch {
    return {};
  }
}

/**
 * Writes the editor state to localStorage.
 *
 * Quota and privacy-mode failures are swallowed: persistence is a
 * convenience, not a correctness requirement.
 *
 * @param state text and page settings to persist.
 */
export function persistState(state: Required<PersistedState>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable or full; ignore.
  }
}
