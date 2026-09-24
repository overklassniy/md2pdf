import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Dropdown.module.scss';
import headerStyles from './Header.module.scss';

interface DropdownProps {
  label: string;
  children: ReactNode;
}

/**
 * Minimal button dropdown used by the Export and Settings header menus.
 * Closes on outside click, Escape, scroll or window resize.
 *
 * The panel is portaled to document.body and positioned with `fixed`:
 * the header has `overflow: auto`, so an absolutely positioned panel would
 * be clipped inside the 40px bar.
 *
 * @param props.label button caption.
 * @param props.children panel content.
 */
export default function Dropdown({ label, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onScroll = (e: Event) => {
      if (panelRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onResize = () => setOpen(false);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={styles.dropdown}>
      <button
        ref={triggerRef}
        type="button"
        className={headerStyles.button}
        onClick={toggle}
        aria-expanded={open}
      >
        {label}
      </button>
      {open &&
        pos &&
        createPortal(
          // no-print: the portaled panel lives outside .header, so it would
          // otherwise end up in the printed output.
          <div
            ref={panelRef}
            className={`${styles.panel} no-print`}
            style={pos}
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  );
}
