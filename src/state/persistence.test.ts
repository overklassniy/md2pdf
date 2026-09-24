import { beforeEach, describe, expect, it } from 'vitest';
import { loadPersistedState, persistState } from './persistence';
import { DEFAULT_PAGE_SETTINGS } from '../export/pageSettings';

describe('persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('round-trips text and settings', () => {
    persistState({
      text: '# Hi',
      settings: DEFAULT_PAGE_SETTINGS,
      scrollSync: true,
    });
    const loaded = loadPersistedState();
    expect(loaded.text).toBe('# Hi');
    expect(loaded.settings?.format).toBe('A4');
  });

  it('round-trips the scrollSync toggle', () => {
    persistState({
      text: '# Hi',
      settings: DEFAULT_PAGE_SETTINGS,
      scrollSync: false,
    });
    expect(loadPersistedState().scrollSync).toBe(false);
  });

  it('returns empty state when nothing is stored or data is corrupt', () => {
    expect(loadPersistedState()).toEqual({});
    window.localStorage.setItem('md2pdf:v1', '{not json');
    expect(loadPersistedState()).toEqual({});
  });
});
