import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COMPACT_QUERY, useMediaQuery } from './useMediaQuery';

function mockMatchMedia(initial: boolean) {
  // getSnapshot re-queries matchMedia on every store change, so `matches`
  // must be a live read rather than a captured constant.
  let current = initial;
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    get matches() {
      return current;
    },
    media: query,
    onchange: null,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
      listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
      listeners.delete(cb),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
  return (next: boolean) => {
    current = next;
    listeners.forEach((cb) =>
      cb({ matches: next } as unknown as MediaQueryListEvent),
    );
  };
}

describe('useMediaQuery', () => {
  const original = window.matchMedia;

  afterEach(() => {
    window.matchMedia = original;
  });

  it('reflects the initial match state', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery(COMPACT_QUERY));
    expect(result.current).toBe(true);
  });

  it('updates when the match state changes', () => {
    const emit = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery(COMPACT_QUERY));
    expect(result.current).toBe(false);
    act(() => emit(true));
    expect(result.current).toBe(true);
  });
});
