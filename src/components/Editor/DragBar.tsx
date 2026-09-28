import { useRef, useState } from 'react';
import styles from './DragBar.module.scss';

interface DragBarProps {
  /**
   * 'row' — side-by-side panes separated by a vertical bar dragged along X;
   * 'column' — stacked panes separated by a horizontal bar dragged along Y.
   */
  layout: 'row' | 'column';
  /**
   * Called during a drag with the bar's desired origin in client
   * coordinates (clientX or clientY minus the grab offset).
   */
  onDrag: (origin: number) => void;
}

/**
 * Split handle between the editor and the preview.
 *
 * Pointer Events with setPointerCapture cover mouse, touch and pen, and keep
 * move/up events flowing to the bar even when the pointer leaves it — no
 * container-level listeners are needed.
 *
 * @param props.layout which axis the bar drags along.
 * @param props.onDrag reports the desired bar origin during a drag.
 */
export default function DragBar({ layout, onDrag }: DragBarProps) {
  const [isDrag, setDrag] = useState(false);
  const grabOffset = useRef(0);
  const vertical = layout === 'column';

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    grabOffset.current = vertical ? e.clientY - rect.top : e.clientX - rect.left;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDrag(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrag) return;
    onDrag((vertical ? e.clientY : e.clientX) - grabOffset.current);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrag) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    setDrag(false);
  };

  return (
    <div
      className={`${styles.dragbar} ${vertical ? styles.horizontal : ''} no-print ${isDrag ? styles.active : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="separator"
      aria-orientation={vertical ? 'horizontal' : 'vertical'}
    />
  );
}
