import { useEffect, useState, type RefObject } from 'react';

const TEXT_FILE_PATTERN = /\.(md|markdown|mdown|mkd|txt)$/i;

interface UseDropOptions {
  /** Called with file text once a dropped text file has been read. */
  onText: (content: string) => void;
}

/**
 * Adds drag-and-drop file loading to a container element.
 *
 * Accepts markdown/plain-text files (.md, .markdown, .mdown, .mkd, .txt);
 * everything else is ignored. Image drops are handled separately by the
 * CodeMirror paste/drop extension.
 *
 * @param ref element that acts as the drop target.
 * @param options.onText callback receiving the file content.
 * @returns [isOver] — whether a file is currently dragged over the target.
 */
export function useDrop(
  ref: RefObject<HTMLElement | null>,
  { onText }: UseDropOptions,
): [boolean] {
  const [isOver, setOver] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const stopDefault = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const dragOverHandler = (e: Event) => {
      setOver(true);
      stopDefault(e);
    };
    const dragLeaveHandler = (e: Event) => {
      setOver(false);
      stopDefault(e);
    };
    const dropHandler = (e: DragEvent) => {
      setOver(false);
      const file = e.dataTransfer?.files?.[0];
      // Only intercept text files; images and other payloads must keep
      // propagating so the editor's own drop handler can take them.
      if (file && TEXT_FILE_PATTERN.test(file.name)) {
        stopDefault(e);
        const reader = new FileReader();
        reader.onload = () => onText(String(reader.result ?? ''));
        reader.readAsText(file);
      }
    };

    target.addEventListener('dragenter', stopDefault, true);
    target.addEventListener('dragover', dragOverHandler, true);
    target.addEventListener('dragleave', dragLeaveHandler, true);
    target.addEventListener('drop', dropHandler, true);
    return () => {
      target.removeEventListener('dragenter', stopDefault, true);
      target.removeEventListener('dragover', dragOverHandler, true);
      target.removeEventListener('dragleave', dragLeaveHandler, true);
      target.removeEventListener('drop', dropHandler, true);
    };
  }, [ref, onText]);

  return [isOver];
}
