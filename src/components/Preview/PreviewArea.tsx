import { forwardRef, lazy, Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import Loading from './Loading';
import styles from './PreviewArea.module.scss';

const LazyPreview = lazy(() => import('./Preview'));

interface PreviewAreaProps {
  source: string;
}

/**
 * Preview pane wrapper: scroll container + error boundary + lazy loading of
 * the (heavy) markdown rendering pipeline.
 */
const PreviewArea = forwardRef<HTMLDivElement, PreviewAreaProps>(
  ({ source }, ref) => (
    <ErrorBoundary>
      <div ref={ref} className={styles.wrapper}>
        <Suspense fallback={<Loading />}>
          <LazyPreview source={source} />
        </Suspense>
      </div>
    </ErrorBoundary>
  ),
);

PreviewArea.displayName = 'PreviewArea';

export default PreviewArea;
