import type { ElementRef } from 'react';

import Page from './Page';
import { Section } from './Section';

function toElements(elements: Iterable<Element>): HTMLElement[] {
  return Array.from(elements) as HTMLElement[];
}

export function flow(ref: ElementRef<'div'>): Section[] {
  let pageNumber = 1;
  return toElements(ref.querySelectorAll('.section .content')).map(
    (ePage, i) => {
      // at this point in the process, there's a 1:1 correspondence between pages and sections
      const section = new Section(i + 1, pageNumber);
      let page = new Page(pageNumber++, ePage);
      for (const node of toElements(ePage.children)) {
        page.add(node);
        // determine if we've started to overflow or we've encountered a break
        const overflow = page.isOverflowing;
        const hasPageBreak = node.classList.contains('mw-break-page');
        if (overflow || hasPageBreak) {
          const prev = page;
          // pop that last item—we'll put it on the next page
          prev.pop();
          // close the page and create a new one
          section.add(prev);
          page = new Page(pageNumber++, ePage);
          // if we're ending with a header, put that puppy on the next page
          if (overflow) {
            const last = prev.pop();
            if (last) {
              if (/h/i.test(last.tagName)) {
                page.add(last);
              } else {
                prev.add(last);
              }
            }
          }
          page.add(node);
        }
      }
      section.add(page);
      return section;
    }
  );
}
