export default class Region {
  public elements: HTMLElement[] = [];

  public get size() {
    return this.elements.length;
  }

  public get height() {
    const i = (v: string | null) => (v ? parseInt(v, 10) : 0);
    let [sum, bottom] = [0, 0];
    for (const node of this.elements) {
      const { height } = node.getBoundingClientRect();
      const s = getComputedStyle(node);
      // get margins for current node.
      const m = { bottom: i(s.marginBottom), top: i(s.marginTop) };
      // add whichever is bigger, the bottom margin of the previous node or the
      // top margin of the current node. collapsing margins, hooray!
      sum += height + Math.max(bottom, m.top);
      bottom = m.bottom;
    }
    return sum;
  }

  public add(element: HTMLElement) {
    this.elements.push(element);
  }
}
