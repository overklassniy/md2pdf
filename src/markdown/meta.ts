import { parse as parseYaml } from 'yaml';

const FRONT_MATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;
const FENCED_CODE_PATTERN = /`{3,}[\s\S]*?`{3,}|~{3,}[\s\S]*?~{3,}/g;
const H1_PATTERN = /^#\s+(.+)$/m;

/**
 * Parses the YAML front matter block at the start of a document.
 *
 * @param text markdown source.
 * @returns the parsed front matter object, or null when absent/invalid.
 */
export function extractFrontMatter(
  text: string,
): Record<string, unknown> | null {
  const match = FRONT_MATTER_PATTERN.exec(text);
  if (!match) return null;
  try {
    const data: unknown = parseYaml(match[1]);
    return typeof data === 'object' && data !== null
      ? (data as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/**
 * Resolves the title used as the printed document name.
 *
 * Priority: front matter `title` → first H1 (code fences excluded) →
 * the literal 'document'.
 *
 * @param text markdown source.
 * @returns a human-readable document title.
 */
export function resolveDocumentTitle(text: string): string {
  const frontMatter = extractFrontMatter(text);
  const fmTitle = frontMatter?.title;
  if (typeof fmTitle === 'string' && fmTitle.trim()) return fmTitle.trim();

  const withoutCode = text.replace(FENCED_CODE_PATTERN, '');
  const h1 = H1_PATTERN.exec(withoutCode);
  if (h1) {
    const cleaned = h1[1].replace(/[#*_`~[\]()]/g, '').trim();
    if (cleaned) return cleaned;
  }
  return 'document';
}

/**
 * Converts a title into a filesystem-safe base name for downloads.
 *
 * @param title document title.
 * @returns a sanitized file name without extension.
 */
export function toFileName(title: string): string {
  const base = title
    .replace(/[\\/:*?"<>|]+/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return base || 'document';
}
