import type { SingleASTNode } from 'simple-markdown';

import { flow } from '../../lib/flow';
import { getNodes } from '../utils';
import { getPage } from './getPage';
import { getPageFootnotes } from './getPageFootnotes';

export function getASTFlowed(
  ast: SingleASTNode[],
  container: HTMLDivElement
): SingleASTNode[] {
  return flow(container).map(section => {
    const title = getNodes('heading', ast)
      .filter(node => section.ids.includes(node.id) && node.level === 1)
      .flatMap(item => item.content);

    return {
      type: 'mw-section',
      id: section.number,
      content: section.pages.map(page => {
        const content = ast.filter(node => page.ids.includes(node.id));
        const footnotes = getPageFootnotes(
          getNodes('mw-footnote', ast).filter(fn => !fn.inline),
          content
        );
        return getPage(section, page, content, title, footnotes);
      })
    };
  });
}
