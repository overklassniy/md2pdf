import { afterEach, describe, expect, it, vi } from 'vitest';
import { isPrintSupported, needsPrintHint } from './printSupport';

function stubPlatform(platform: string, maxTouchPoints = 0) {
  vi.spyOn(navigator, 'platform', 'get').mockReturnValue(platform);
  // jsdom does not implement maxTouchPoints, so it cannot be spied on;
  // an own property shadows whatever a real browser would expose.
  Object.defineProperty(navigator, 'maxTouchPoints', {
    value: maxTouchPoints,
    configurable: true,
  });
}

describe('isPrintSupported', () => {
  const original = window.print;

  afterEach(() => {
    window.print = original;
  });

  it('is true when window.print exists', () => {
    expect(isPrintSupported()).toBe(true);
  });

  it('is false when window.print is missing', () => {
    // @ts-expect-error simulate a browser without print support
    window.print = undefined;
    expect(isPrintSupported()).toBe(false);
  });
});

describe('needsPrintHint', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (navigator as unknown as Record<string, unknown>).maxTouchPoints;
  });

  it('is true on iOS devices', () => {
    stubPlatform('iPhone');
    expect(needsPrintHint()).toBe(true);
  });

  it('is true on iPadOS reporting a desktop platform', () => {
    stubPlatform('MacIntel', 5);
    expect(needsPrintHint()).toBe(true);
  });

  it('is false on a desktop browser', () => {
    stubPlatform('Win32', 0);
    expect(needsPrintHint()).toBe(false);
  });
});
