import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import 'normalize.css';
import './styles/global.scss';
import './styles/print.scss';
import App from './App';

// Prevent the browser navigating away when a file is dropped outside the app.
window.addEventListener('drop', (e) => e.preventDefault(), true);
window.addEventListener('dragover', (e) => e.preventDefault(), true);

// paged.js renders into this container while printing; it lives outside the
// React root so the whole app can be hidden in that mode. It is inserted
// BEFORE #root on purpose: the paged clone duplicates every heading id of
// the live preview, and Chrome resolves #fragment link destinations by the
// first element carrying the id in DOM order. A display:none original wins
// that lookup, poisons the PDF named-destination map, and turns internal
// (TOC) links dead — keeping the printed clone first avoids that.
const printRoot = document.createElement('div');
printRoot.id = 'print-root';
document.body.insertBefore(printRoot, document.getElementById('root'));

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
