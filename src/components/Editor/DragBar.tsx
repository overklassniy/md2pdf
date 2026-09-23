import styles from './DragBar.module.scss';

interface DragBarProps {
  isDrag: boolean;
  onDragStart: (offsetX: number) => void;
}

/**
 * Vertical split handle between the editor and the preview.
 *
 * @param props.isDrag whether a drag is in progress (tints the bar).
 * @param props.onDragStart called with the mousedown offset inside the bar.
 */
export default function DragBar({ isDrag, onDragStart }: DragBarProps) {
  return (
    <div
      className={`${styles.dragbar} no-print ${isDrag ? styles.active : ''}`}
      onMouseDown={(e) => onDragStart(e.nativeEvent.offsetX)}
      role="separator"
      aria-orientation="vertical"
    />
  );
}
