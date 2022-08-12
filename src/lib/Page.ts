const i = (v: string | null): number => (v ? parseInt(v) : 0);

export default class Page {
  public static FOOTNOTE_BLOCK_HEIGHT = 48;
  public readonly number: number = 0;

  protected elementNotes: Map<HTMLElement, number> = new Map();
  protected bounds: { width: number; height: number };
  protected container: HTMLElement;
  protected elements: HTMLElement[] = [];

  public constructor(page: number, element: HTMLElement) {
    this.container = element;
    this.number = page;
    const dimensions = element.getBoundingClientRect();
    const columnCount = i(getComputedStyle(element).columnCount) || 1;
    const width = dimensions.width;
    const height = dimensions.height * columnCount;
    this.bounds = { width, height };
  }

  public get ids(): string[] {
    return this.elements.map(element => element.id);
  }

  public get footnotes(): number {
    return Array.from(this.elementNotes.values()).reduce((a, b) => a + b, 0);
  }

  public get height(): number {
    let [sum, bottom] = [0, 0];

    for (const node of this.elements) {
      // get margins for current node.
      const style = getComputedStyle(node);
      const height = node.offsetHeight;
      const [mt, mb] = [i(style.marginTop), i(style.marginBottom)];
      // add whichever is bigger, the bottom margin of the previous node or the
      // top margin of the current node. collapsing margins, hooray!
      sum += height + Math.max(mt, bottom);

      bottom = mb;
    }
    sum += bottom;

    return sum;
  }

  public get isOverflowing(): boolean {
    // const footnoteBlock = this.footnotes * Page.FOOTNOTE_BLOCK_HEIGHT;
    // const style = getComputedStyle(this.container);
    // const cols = i(style.columnCount);
    // const footnoteBlock = this.footnotes * Page.FOOTNOTE_BLOCK_HEIGHT;
    return this.height > this.bounds.height;
  }

  public add(element: HTMLElement): void {
    this.elements.push(element);

    const footnotes = Array.from(element.querySelectorAll('.footnote')).length;
    if (footnotes) {
      this.elementNotes.set(element, footnotes);
    }
  }

  public pop(): HTMLElement | null {
    const popped = this.elements.pop();
    if (popped) {
      this.elementNotes.delete(popped);
    }
    return popped ?? null;
  }
}
