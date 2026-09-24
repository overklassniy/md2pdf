import { useEffect, type RefObject } from 'react';
import type { EditorView } from '@codemirror/view';

/** Time after the last scroll event before the other pane may take over. */
const DRIVER_TIMEOUT_MS = 120;

/**
 * Synchronizes scrolling between the CodeMirror editor and the preview.
 *
 * The mapping is line-based: the rehypeSourceLine plugin stamps
 * `data-source-line` on rendered block elements, so the editor's first
 * visible line is interpolated between the two surrounding preview blocks
 * (and vice versa). When a document produces no markers the sync falls back
 * to proportional scrollTop ratios.
 *
 * A "driver" lock gives the pane the user is scrolling exclusive control
 * until it settles; a rAF-based lock would release before the programmatic
 * scroll event arrives on the target pane, letting the two listeners feed
 * each other and bounce the scrollbar.
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
    const view = editorView;
    if (!enabled || !preview || !scroller || !view) return;

    let driver: 'editor' | 'preview' | null = null;
    let driverTimer: number | undefined;

    const claimDriver = (side: 'editor' | 'preview') => {
      if (driver !== null && driver !== side) return false;
      driver = side;
      window.clearTimeout(driverTimer);
      driverTimer = window.setTimeout(() => {
        driver = null;
      }, DRIVER_TIMEOUT_MS);
      return true;
    };

    const proportional = (from: HTMLElement, to: HTMLElement) => {
      const maxFrom = from.scrollHeight - from.clientHeight;
      const maxTo = to.scrollHeight - to.clientHeight;
      const ratio = maxFrom > 0 ? from.scrollTop / maxFrom : 0;
      to.scrollTop = ratio * maxTo;
    };

    const lineBlocks = () =>
      Array.from(preview.querySelectorAll<HTMLElement>('[data-source-line]'));

    const lineOf = (el: HTMLElement) => Number(el.dataset.sourceLine);

    /** Absolute offset of el inside the preview scroll container. */
    const blockTop = (el: HTMLElement) =>
      el.getBoundingClientRect().top -
      preview.getBoundingClientRect().top +
      preview.scrollTop;

    const syncEditorToPreview = () => {
      const blocks = lineBlocks();
      if (blocks.length === 0) return proportional(scroller, preview);

      const doc = view.state.doc;
      const topBlock = view.lineBlockAtHeight(scroller.scrollTop);
      const topLine = doc.lineAt(topBlock.from).number;
      const frac =
        topBlock.height > 0
          ? (scroller.scrollTop - topBlock.top) / topBlock.height
          : 0;

      let el1: HTMLElement | null = null;
      let el2: HTMLElement | null = null;
      for (const el of blocks) {
        if (lineOf(el) <= topLine) el1 = el;
        else {
          el2 = el;
          break;
        }
      }
      el1 ??= blocks[0];

      const l1 = lineOf(el1);
      const t1 = blockTop(el1);
      if (el2) {
        // Spread the lines spanned by el1 across the gap to the next block.
        const l2 = lineOf(el2);
        const t2 = blockTop(el2);
        const f = l2 > l1 ? Math.min((topLine - l1 + frac) / (l2 - l1), 1) : 0;
        preview.scrollTop = t1 + f * (t2 - t1);
      } else {
        preview.scrollTop = t1 + frac * el1.getBoundingClientRect().height;
      }
    };

    const syncPreviewToEditor = () => {
      const blocks = lineBlocks();
      if (blocks.length === 0) return proportional(preview, scroller);

      const previewTop = preview.getBoundingClientRect().top;
      let idx = blocks.findIndex(
        (el) => el.getBoundingClientRect().bottom > previewTop,
      );
      if (idx === -1) idx = blocks.length - 1;

      const el1 = blocks[idx];
      const l1 = lineOf(el1);
      let el2: HTMLElement | null = null;
      let l2 = l1 + 1;
      for (let i = idx + 1; i < blocks.length; i++) {
        const l = lineOf(blocks[i]);
        if (l > l1) {
          el2 = blocks[i];
          l2 = l;
          break;
        }
      }

      const r1 = el1.getBoundingClientRect();
      const span = el2
        ? el2.getBoundingClientRect().top - r1.top
        : r1.height;
      const frac =
        span > 0 ? Math.min(Math.max((previewTop - r1.top) / span, 0), 1) : 0;

      const doc = view.state.doc;
      const target = l1 + frac * (l2 - l1);
      const lineA = Math.min(Math.max(Math.floor(target), 1), doc.lines);
      const sub = Math.min(Math.max(target - lineA, 0), 1);
      const block = view.lineBlockAt(doc.line(lineA).from);
      scroller.scrollTop = block.top + sub * block.height;
    };

    const onEditorScroll = () => {
      if (!claimDriver('editor')) return;
      syncEditorToPreview();
    };

    const onPreviewScroll = () => {
      if (!claimDriver('preview')) return;
      syncPreviewToEditor();
    };

    scroller.addEventListener('scroll', onEditorScroll, { passive: true });
    preview.addEventListener('scroll', onPreviewScroll, { passive: true });
    return () => {
      window.clearTimeout(driverTimer);
      scroller.removeEventListener('scroll', onEditorScroll);
      preview.removeEventListener('scroll', onPreviewScroll);
    };
  }, [editorView, previewRef, enabled]);
}
