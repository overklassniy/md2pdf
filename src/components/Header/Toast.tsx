import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.scss';

interface ToastProps {
  /** Text shown to the user. */
  message: string;
  /** Called on tap or when the auto-dismiss timer expires. */
  onDismiss: () => void;
}

const DISMISS_MS = 6000;

/**
 * Transient bottom notification for non-blocking hints (e.g. the mobile
 * print fallback). Portaled to document.body — the header has
 * `overflow: auto`, which would clip it — and marked no-print so it never
 * reaches exported output. Tap to dismiss.
 *
 * @param props.message notification text.
 * @param props.onDismiss dismiss callback.
 */
export default function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  return createPortal(
    <div
      className={`${styles.toast} no-print`}
      role="status"
      onClick={onDismiss}
    >
      {message}
    </div>,
    document.body,
  );
}
