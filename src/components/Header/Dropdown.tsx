import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './Dropdown.module.scss';

interface DropdownProps {
  label: string;
  children: ReactNode;
}

/**
 * Minimal button dropdown used by the Export and Settings header menus.
 * Closes on outside click or Escape.
 *
 * @param props.label button caption.
 * @param props.children panel content.
 */
export default function Dropdown({ label, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={styles.dropdown}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {label}
      </button>
      {open && <div className={styles.panel}>{children}</div>}
    </div>
  );
}
