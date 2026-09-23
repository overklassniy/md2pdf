import { useEffect, type RefObject } from 'react';
import type { EditorView } from '@codemirror/view';

/**
 * Synchronizes scrolling between the CodeMirror editor and the preview.
 *
 * The mapping is proportional: scrollTop ratios are matched, which keeps the
 * two panes roughly aligned without source-map complexity. A reentrancy lock
 * prevents the two scroll listeners from feeding each other forever.
 *
 * @param editorView current CodeMirror view, or null before mount.
 * @param previewRef ref to the scrolling preview container.
 * @param enabled whether syncing is active.
 */
export function useScrollSync(
  editorView: EditorView | null,
  previewRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): void {
  useEffect(() => {
    const preview = previewRef.current;
    const scroller = editorView?.scrollDOM;
    if (!enabled || !preview || !scroller) return;

    let locked = false;

    const makeHandler = (from: HTMLElement, to: HTMLElement) => () => {
      if (locked) return;
      locked = true;
      const maxFrom = from.scrollHeight - from.clientHeight;
      const maxTo = to.scrollHeight - to.clientHeight;
      const ratio = maxFrom > 0 ? from.scrollTop / maxFrom : 0;
      to.scrollTop = ratio * maxTo;
      requestAnimationFrame(() => {
        locked = false;
      });
    };

    const onEditorScroll = makeHandler(scroller, preview);
    const onPreviewScroll = makeHandler(preview, scroller);

    scroller.addEventListener('scroll', onEditorScroll, { passive: true });
    preview.addEventListener('scroll', onPreviewScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', onEditorScroll);
      preview.removeEventListener('scroll', onPreviewScroll);
    };
  }, [editorView, previewRef, enabled]);
}
