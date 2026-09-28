import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

// jsdom cannot drive CodeMirror 6 (missing measure APIs), so the editor is
// replaced by a plain textarea that preserves the value/onChange contract.
vi.mock('@uiw/react-codemirror', () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <textarea
      aria-label="editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('virtual:pwa-register', () => ({ registerSW: vi.fn() }));

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(async () => ({ svg: '<svg></svg>' })),
  },
}));

describe('App', () => {
  it('renders header, editor and preview', async () => {
    render(<App />);
    expect(screen.getByText('md2pdf')).toBeInTheDocument();
    expect(await screen.findByLabelText('editor')).toBeInTheDocument();
    // The lazy preview eventually renders the sample document.
    expect(
      await screen.findByText(/Awesome/, {}, { timeout: 5000 }),
    ).toBeInTheDocument();
  });

  it('stacks the panes vertically on narrow screens', async () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    try {
      render(<App />);
      expect(document.querySelector('.app__main')).toHaveClass(
        'app__main--column',
      );
    } finally {
      window.matchMedia = original;
    }
  });
});
