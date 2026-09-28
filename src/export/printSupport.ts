/**
 * Capability checks for the browser print flow.
 *
 * @returns whether window.print() exists at all.
 */
export function isPrintSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.print === 'function';
}

/**
 * Whether the platform exposes window.print() but calling it is unreliable.
 *
 * iOS Safari declares the function yet the call is often a silent no-op —
 * printing there goes through Share > Print in the share sheet. Detection
 * is heuristic (platform string, plus iPadOS's desktop 'MacIntel' UA
 * identified by multi-touch support); a false positive only costs a
 * dismissible hint toast.
 *
 * @returns true when the user may need the share-sheet hint.
 */
export function needsPrintHint(): boolean {
  if (typeof navigator === 'undefined') return false;
  const platform = navigator.platform ?? '';
  if (/iPad|iPhone|iPod/.test(platform)) return true;
  return platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}
