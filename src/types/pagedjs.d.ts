/**
 * Minimal type declarations for the pagedjs package, which ships no types.
 *
 * Only the surface used by src/print is declared.
 */
declare module 'pagedjs' {
  /** Result object resolved by Previewer.preview(). */
  export interface FlowResult {
    /** Total number of rendered pages. */
    total: number;
    /** Elapsed render time in milliseconds, when reported. */
    performance?: number;
  }

  /** Processes stylesheets and injects base styles into document.head. */
  export interface Polisher {
    /** Removes every style element the polisher inserted into <head>. */
    destroy(): void;
  }

  /** Paginates HTML content into CSS Paged Media page boxes. */
  export class Previewer {
    constructor(options?: Record<string, unknown>);

    /** The stylesheet polisher; assigned by the constructor. */
    polisher: Polisher;

    /**
     * Flows content into paginated output inside renderTo.
     *
     * @param content DOM content to paginate (cloned sources are supported).
     * @param stylesheets stylesheet hrefs or style objects.
     * @param renderTo target element that receives the .pagedjs_pages output.
     * @returns the rendered flow result.
     */
    preview(
      content?: HTMLElement | DocumentFragment | string,
      stylesheets?: Array<string | Record<string, unknown>>,
      renderTo?: HTMLElement | string,
    ): Promise<FlowResult>;
  }

  /**
   * Registers custom paged media handlers.
   *
   * @param handlers handler objects implementing pagedjs hooks.
   */
  export function registerHandlers(...handlers: object[]): void;
}
