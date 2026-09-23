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
});
