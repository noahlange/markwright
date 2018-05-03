import Markwright from '../Markwright';


export default class Region {
  public elements: HTMLElement[] = [];

  public get size() {
    return this.elements.length;
  }

  public get height() {
    const i = v => parseInt(v, 10);
    let [ sum, top, bottom ] = [ 0, 0, 0] ;
    for (const node of this.elements) {
      const s = getComputedStyle(node);
      // get margins for current node.
      const m = { bottom: i(s.marginBottom), top: i(s.marginTop) };
      // add whichever is bigger, the bottom margin of the previous node or the
      // top margin of the current node. collapsing margins, hooray!
      sum += i(s.height) + Math.max(bottom, m.top);
      bottom = m.bottom;
      top = m.top;
    }
    return sum;
  }

  public add(element: HTMLElement) {
    this.elements.push(element);
  }
}
