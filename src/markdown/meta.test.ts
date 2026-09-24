import { describe, expect, it } from 'vitest';
import {
  extractFrontMatter,
  resolveDocumentTitle,
  toFileName,
} from './meta';

describe('meta', () => {
  it('parses yaml front matter', () => {
    expect(extractFrontMatter('---\ntitle: Hello\n---\nbody')).toEqual({
      title: 'Hello',
    });
    expect(extractFrontMatter('no front matter')).toBeNull();
    expect(extractFrontMatter('---\n[broken\n---\nbody')).toBeNull();
  });

  it('prefers front matter title over the first heading', () => {
    const doc = '---\ntitle: From FM\n---\n\n# From H1';
    expect(resolveDocumentTitle(doc)).toBe('From FM');
  });

  it('falls back to the first H1 and strips markdown marks', () => {
    expect(resolveDocumentTitle('# My *Doc* `v2`')).toBe('My Doc v2');
  });

  it('ignores # lines inside fenced code when finding the title', () => {
    const doc = '```\n# not a heading\n```\n\n# Real Title';
    expect(resolveDocumentTitle(doc)).toBe('Real Title');
  });

  it('defaults to document when no title exists', () => {
    expect(resolveDocumentTitle('plain text')).toBe('document');
  });

  it('sanitizes titles into file names', () => {
    expect(toFileName('My Doc: v1?')).toBe('My-Doc-v1');
    expect(toFileName('///')).toBe('document');
  });
});
