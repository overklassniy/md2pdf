import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * Contains render failures inside the preview pane.
 *
 * A broken plugin or renderer must not take the editor down with it — the
 * fallback offers a reload, and the document itself survives in
 * localStorage.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Preview render failed', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem' }}>
          <p>Something went wrong while rendering the preview.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload this page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
