import { useCallback, useSyncExternalStore } from 'react';

/**
 * Layouts switch to the stacked (editor over preview) mode below this
 * viewport width. Exported so every consumer shares one breakpoint.
 */
export const COMPACT_QUERY = '(max-width: 767.98px)';

/**
 * Tracks a media query and re-renders when its match state changes.
 *
 * @param query CSS media query string.
 * @returns whether the query currently matches.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onStoreChange);
      return () => mql.removeEventListener('change', onStoreChange);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () =>
    window.matchMedia(query).matches,
  );
}
