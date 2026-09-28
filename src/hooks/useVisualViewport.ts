import { useEffect } from 'react';

/**
 * Pins the app height to the visual viewport via the `--app-height` CSS
 * variable.
 *
 * iOS Safari resizes only the visual viewport when the on-screen keyboard
 * opens — the layout viewport (and therefore `100dvh`) keeps its size, so
 * the bottom of the app is pushed under the keyboard. Tracking
 * `visualViewport.height` keeps the app inside the visible area. On
 * Android, `interactive-widget=resizes-content` already resizes the layout
 * viewport; the variable then simply mirrors the same height.
 */
export function useVisualViewport(): void {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      document.documentElement.style.setProperty(
        '--app-height',
        `${viewport.height}px`,
      );
    };

    update();
    viewport.addEventListener('resize', update);
    return () => {
      viewport.removeEventListener('resize', update);
      document.documentElement.style.removeProperty('--app-height');
    };
  }, []);
}
