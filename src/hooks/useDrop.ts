import { useEffect, useState, type RefObject } from 'react';

const TEXT_FILE_PATTERN = /\.(md|markdown|mdown|mkd|txt)$/i;

interface UseDropOptions {
  /** Called with file text once a dropped text file has been read. */
  onText: (content: string) => void;
  /** Called with the image file and the drop event for image payloads. */
  onImage?: (file: File, event: DragEvent) => void;
}

/**
 * Adds drag-and-drop file loading to a container element.
 *
 * Accepts markdown/plain-text files (.md, .markdown, .mdown, .mkd, .txt)
 * and, when `onImage` is given, image files dropped anywhere on the
 * container. Remaining file drops are cancelled so the browser does not
 * navigate to the file.
 *
 * @param ref element that acts as the drop target.
 * @param options.onText callback receiving the file content.
 * @param options.onImage callback receiving the image file and drop event.
 * @returns [isOver] — whether a file is currently dragged over the target.
 */
export function useDrop(
  ref: RefObject<HTMLElement | null>,
  { onText, onImage }: UseDropOptions,
): [boolean] {
  const [isOver, setOver] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const isFileDrag = (e: DragEvent) =>
      e.dataTransfer?.types.includes('Files') ?? false;

    // preventDefault permits dropping, but propagation must continue so
    // CodeMirror still sees the drag (drop cursor, its own drop handler).
    const dragEnterHandler = (e: DragEvent) => {
      e.preventDefault();
    };
    const dragOverHandler = (e: DragEvent) => {
      e.preventDefault();
      if (isFileDrag(e)) setOver(true);
    };
    const dragLeaveHandler = () => {
      setOver(false);
    };
    const dropHandler = (e: DragEvent) => {
      setOver(false);
      const file = e.dataTransfer?.files?.[0];
      if (!file) {
        // Non-file payloads (e.g. a dragged link) reach CodeMirror inside
        // the editor; elsewhere the default action may navigate away.
        const inEditor =
          e.target instanceof Element && e.target.closest('.cm-content');
        if (!inEditor) e.preventDefault();
        return;
      }
      if (TEXT_FILE_PATTERN.test(file.name)) {
        e.preventDefault();
        e.stopPropagation();
        const reader = new FileReader();
        reader.onload = () => onText(String(reader.result ?? ''));
        reader.readAsText(file);
      } else if (onImage && file.type.startsWith('image/')) {
        e.preventDefault();
        e.stopPropagation();
        onImage(file, e);
      } else {
        // Unhandled payloads are cancelled: the default action would
        // navigate away to the dropped file.
        e.preventDefault();
      }
    };

    target.addEventListener('dragenter', dragEnterHandler, true);
    target.addEventListener('dragover', dragOverHandler, true);
    target.addEventListener('dragleave', dragLeaveHandler, true);
    target.addEventListener('drop', dropHandler, true);
    return () => {
      target.removeEventListener('dragenter', dragEnterHandler, true);
      target.removeEventListener('dragover', dragOverHandler, true);
      target.removeEventListener('dragleave', dragLeaveHandler, true);
      target.removeEventListener('drop', dropHandler, true);
    };
  }, [ref, onText, onImage]);

  return [isOver];
}
