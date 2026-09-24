import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';

/**
 * Reads an image file and inserts it into the document as a base64 data URI
 * markdown image. Data URIs keep the exported PDF and HTML self-contained.
 *
 * Shared by the CodeMirror paste/drop extension and the app-level drop
 * handling in `useDrop`, which forwards image drops landing anywhere on
 * the split view.
 *
 * @param view editor view to dispatch the insertion into.
 * @param file image file from clipboard or drag event.
 * @param at explicit document position; defaults to the cursor.
 */
export function insertImageFile(
  view: EditorView,
  file: File,
  at?: number,
): void {
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = String(reader.result ?? '');
    if (!dataUrl) return;
    // Brackets would break out of the alt text and corrupt the snippet.
    const alt = (file.name || 'image').replace(/[[\]]/g, '');
    const snippet = `![${alt}](${dataUrl})`;
    if (at === undefined) {
      view.dispatch(view.state.replaceSelection(snippet));
    } else {
      view.dispatch({
        changes: { from: at, insert: snippet },
        selection: { anchor: at + snippet.length },
      });
    }
    view.focus();
  };
  reader.readAsDataURL(file);
}

function firstImage(files: FileList | null | undefined): File | undefined {
  return Array.from(files ?? []).find((f) => f.type.startsWith('image/'));
}

/**
 * CodeMirror extension that turns pasted or dropped images into embedded
 * base64 markdown images.
 *
 * @returns a CodeMirror extension providing paste/drop DOM handlers.
 */
export function imagePaste(): Extension {
  return EditorView.domEventHandlers({
    paste(event, view) {
      const file = firstImage(event.clipboardData?.files);
      if (!file) return false;
      event.preventDefault();
      insertImageFile(view, file);
      return true;
    },
    drop(event, view) {
      const file = firstImage(event.dataTransfer?.files);
      if (!file) return false;
      event.preventDefault();
      const pos = view.posAtCoords({
        x: event.clientX,
        y: event.clientY,
      });
      insertImageFile(view, file, pos ?? undefined);
      return true;
    },
  });
}
